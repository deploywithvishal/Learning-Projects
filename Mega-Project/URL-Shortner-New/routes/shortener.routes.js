import crypto from "crypto";

import { fileURLToPath } from "url";
import {postURLShortener} from "../controllers/postshortner.contoller.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Router } from "express";

const router = Router();


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


router.post("/", postURLShortener(loadLinks, saveLinks));

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
