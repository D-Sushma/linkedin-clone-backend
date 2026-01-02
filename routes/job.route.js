import express from "express";
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
} from "../controllers/job.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getJobs).post(protect, createJob);
router.route("/:id").get(getJob).put(protect, updateJob).delete(protect, deleteJob);
router.post("/:id/apply", protect, applyToJob);

export default router;

