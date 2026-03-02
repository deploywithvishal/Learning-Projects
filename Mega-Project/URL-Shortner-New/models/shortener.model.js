import path, { dirname } from "path";
import { readFile, mkdir, writeFile } from "fs/promises";

const DATA_FILE = path.join(__dirname, "../data", "links.json");

export const loadLinks = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");

    if (!data) return {};

    try {
      return JSON.parse(data);
    } catch {
      await writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      await mkdir(path.dirname(DATA_FILE), { recursive: true });
      await writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
};

const saveLinks = async (links) => {
  await writeFile(DATA_FILE, JSON.stringify(links));
};