import crypto from "crypto";
// import { readFile} from "fs/promises";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";
import { loadLinks, saveLinks } from "../models/shortener.model.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export const getShortenerPage = async (req, res) => {
  try {
    // const file = await readFile(path.join(__dirname, "../views", "index.html"));
    const links = await loadLinks();

    return res.render("index", {links, host:req.host})
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const postURLShortener = async (req, res) => {
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
};


export const redirectToShortLink = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const links = await loadLinks();
    if (!links[shortCode]) return res.status(404).send("404 error occurred");
    return res.redirect(links[shortCode]);
  } catch (error) {
    console.log("Error 3: ", error);
  }
}