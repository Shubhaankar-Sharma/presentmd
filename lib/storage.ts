import { uploadToR2, getFromR2, deleteFromR2 } from "./r2";

export interface Presentation {
  id: string;
  title: string;
  slides: string[];
  createdAt: string;
}

const metaKey = (id: string) => `presentations/${id}/_meta.json`;

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
