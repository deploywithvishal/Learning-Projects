import { readFile, mkdir, writeFile } from "fs/promises";
import crypto from "crypto";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = path.join(__dirname, "data", "links.json");

const loadLinks = async () => {
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

app.get("/", async (req, res) => {
  try {
    const file = await readFile(path.join(__dirname, "views", "index.html"));
    const links = await loadLinks();

    const content = file.toString().replaceAll(
      "{{shortened_urls}}",
      Object.entries(links)
        .map(
          ([shortCode, url]) =>
            `<li><a href="/${shortCode}" target="_blank">${req.headers.host}/${shortCode}</a> -> ${url}</li>`,
        )
        .join(""),
    );

    return res.send(content);
  } catch (error) {
    console.log("Error: ", error);
  }
});

app.post("/", async (req, res) => {
  try {
    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
    const links = await loadLinks();
    if (links[finalShortCode]) {
      return res
        .status(400)
        .send("Short code already exists. Please choose another.");
    }
    links[finalShortCode] = url;
    await saveLinks(links);
    return res.redirect("/");
  } catch (error) {
    console.log("Error 2: ", error);
  }
});

app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const links = await loadLinks();
    if (!links[shortCode]) return res.status(404).send("404 error occurred");
    return res.redirect(links[shortCode]);
  } catch (error) {
    console.log("Error 3: ", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
