import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  getUserConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  getSuggestions,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/suggestions", protect, getSuggestions);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", protect, updateUser);
router.get("/:id/connections", getUserConnections);
router.post("/:id/connect", protect, sendConnectionRequest);
router.put("/:id/accept", protect, acceptConnectionRequest);

export default router;

