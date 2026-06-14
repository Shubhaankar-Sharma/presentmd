import { uploadToR2, getFromR2, deleteFromR2 } from "./r2";

export interface Presentation {
  id: string;
  title: string;
  slides: string[];
  createdAt: string;
  presenterToken?: string;
}

export interface LiveState {
  slide: number;
  updatedAt: string;
}

const metaKey = (id: string) => `presentations/${id}/_meta.json`;
const liveKey = (id: string) => `presentations/${id}/live.json`;

export async function savePresentation(id: string, data: Omit<Presentation, "id">) {
  const presentation: Presentation = { id, ...data };
  await uploadToR2(metaKey(id), JSON.stringify(presentation), "application/json");
}

export async function getPresentation(id: string): Promise<Presentation | null> {
  const raw = await getFromR2(metaKey(id));
  if (!raw) return null;
  return JSON.parse(raw) as Presentation;
}

export async function deletePresentation(id: string): Promise<void> {
  await deleteFromR2(metaKey(id));
}

export async function getLiveState(id: string): Promise<LiveState | null> {
  const raw = await getFromR2(liveKey(id));
  if (!raw) return null;
  return JSON.parse(raw) as LiveState;
}

export async function setLiveState(id: string, slide: number): Promise<LiveState> {
  const state: LiveState = { slide, updatedAt: new Date().toISOString() };
  await uploadToR2(liveKey(id), JSON.stringify(state), "application/json");
  return state;
}
