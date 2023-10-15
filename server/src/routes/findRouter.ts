import express, { Router, Request, Response } from "express";
import { postFindData } from "../controllers/findController";

const router = express.Router();

router.post("/find", postFindData);

export default router;
