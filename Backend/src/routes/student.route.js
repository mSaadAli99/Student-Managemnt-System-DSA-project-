import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  completeLesson,
  getInvites,
  respondToInvite,
} from "../controllers/class.controller.js";

const router = express.Router();

router.post("/respond-to-invite", authMiddleware, respondToInvite);
router.post("/lesson-complete", authMiddleware, completeLesson);
router.get("/pending-invites", authMiddleware, getInvites);

export default router;
