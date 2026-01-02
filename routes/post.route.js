import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  sharePost,
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getPosts).post(protect, createPost);
router
  .route("/:id")
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);
router.put("/:id/like", protect, likePost);
router.post("/:id/comments", protect, addComment);
router.put("/:id/share", protect, sharePost);

export default router;

