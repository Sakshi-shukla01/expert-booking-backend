import { Router } from "express";
import { getExperts, getExpertById } from "../controllers/expert.controller.js";

const router = Router();

router.get("/", getExperts);
router.get("/:id", getExpertById);

export default router;