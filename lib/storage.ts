import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const DB_PATH = join(DATA_DIR, "presentations.json");

export interface Presentation {
  id: string;
  title: string;
  slides: string[];
  createdAt: string;
}

function ensureDb(): Record<string, Presentation> {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DB_PATH)) writeFileSync(DB_PATH, "{}");
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}

export function savePresentation(id: string, data: Omit<Presentation, "id">) {
  const db = ensureDb();
  db[id] = { id, ...data };
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getPresentation(id: string): Presentation | null {
  const db = ensureDb();
  return db[id] || null;
}

export function deletePresentation(id: string) {
  const db = ensureDb();
  delete db[id];
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
