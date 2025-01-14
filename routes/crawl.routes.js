import express from "express";
import { crawlController } from "../controller/crawl.controller.js";

const router = express.Router();

router.post("/crawl", crawlController);

export default router;