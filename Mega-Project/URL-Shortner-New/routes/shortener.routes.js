import crypto from "crypto";
import path, { dirname } from "path";
import { readFile, mkdir, writeFile } from "fs/promises";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data", "links.json");
import {Router} from "express";

const router = Router();


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

router.get("/report", (req,res)=>{
  const student = {
    name:"Vishal",
    grade:"PG",
    subject:"Math"
  };
  return res.render("report",{student})
})

router.get("/", async (req, res) => {
  try {
    const file = await readFile(path.join(__dirname, "../views", "index.html"));
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

router.post("/", async (req, res) => {
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

router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const links = await loadLinks();
    if (!links[shortCode]) return res.status(404).send("404 error occurred");
    return res.redirect(links[shortCode]);
  } catch (error) {
    console.log("Error 3: ", error);
  }
});

// export default router;


export const shortenedRoutes = router;