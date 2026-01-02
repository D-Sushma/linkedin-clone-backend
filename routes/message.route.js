import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} from "../controllers/message.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get("/", getConversations);
router.get("/:userId", getMessages);
router.post("/", sendMessage);
router.put("/:id/read", markAsRead);

export default router;

