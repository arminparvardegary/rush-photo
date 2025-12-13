import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function safeJsonParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function readDataFile<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const fullPath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(fullPath, "utf8");
    return safeJsonParse(raw, fallback);
  } catch (err: any) {
    if (err?.code === "ENOENT") return fallback;
    throw err;
  }
}

export async function writeDataFile(filename: string, data: unknown): Promise<void> {
  await ensureDataDir();
  const fullPath = path.join(DATA_DIR, filename);
  const tmpPath = `${fullPath}.tmp`;
  const payload = JSON.stringify(data, null, 2);
  await fs.writeFile(tmpPath, payload, "utf8");
  await fs.rename(tmpPath, fullPath);
}


