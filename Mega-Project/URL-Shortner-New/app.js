import { readFile, mkdir } from "fs/promises";
import { createServer } from "http";
import crypto from "crypto";
import path from "path";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

import express from "express";
const app = express();

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = path.join(__dirname, "data", "links.json");

const serveFile = async (res, filePath, contentType) => {
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 page not found.");
  }
};

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




const server = createServer(async (req, res) => {
  if (req.method === "GET") {
    const links = await loadLinks();

    if (req.url === "/") {
      return serveFile(
        res,
        path.join(__dirname, "public", "index.html"),
        "text/html",
      );
    }

    if (req.url === "/style.css") {
      return serveFile(
        res,
        path.join(__dirname, "public", "style.css"),
        "text/css",
      );
    }

    const shortCode = req.url.slice(1);

    if (links[shortCode]) {
      res.writeHead(302, {
        Location: links[shortCode],
      });
      return res.end();
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("Short URL not found");
  }

  if (req.method === "POST" && req.url === "/shorten") {
    let links = {};
    try {
      links = await loadLinks();
    } catch (err) {
      res.writeHead(500);
      return res.end("Server error loading links");
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      if (!body) {
        res.writeHead(400);
        return res.end("Empty request body");
      }

      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch {
        res.writeHead(400);
        return res.end("Invalid JSON");
      }

      const { url, shortCode } = parsed;

      if (!url) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("URL is required");
      }
      try {
        new URL(url);
      } catch {
        res.writeHead(400);
        return res.end("Invalid URL format");
      }

      const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
      if (links[finalShortCode]) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Short code already exists. Please choose another.");
      }

      links[finalShortCode] = url;

      await saveLinks(links);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, shortCode: finalShortCode }));
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
