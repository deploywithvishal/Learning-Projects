import crypto from "crypto";

import {postURLShortener, getShortenerPage, redirectToShortLink} from "../controllers/postshortner.contoller.js"


import { Router } from "express";

const router = Router();

router.get("/", getShortenerPage);

router.post("/", postURLShortener);

router.get("/:shortCode", redirectToShortLink);


export const shortenedRoutes = router;
