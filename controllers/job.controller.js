import Job from "../models/job.model.js";

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const { type, location, company } = req.query;

    let query = {};

    if (type) {
      query.type = type;
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (company) {
      query.company = { $regex: company, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate("postedBy", "name title location avatar")
      .populate("applicants", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name title location avatar")
      .populate("applicants", "name avatar");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res, next) => {
  try {
    req.body.postedBy = req.user.id;

    const job = await Job.create(req.body);

    const populatedJob = await Job.findById(job._id)
      .populate("postedBy", "name title location avatar");

    res.status(201).json({
      success: true,
      data: populatedJob,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure user is job poster
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("postedBy", "name title location avatar");

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Make sure user is job poster
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to job
// @route   POST /api/jobs/:id/apply
// @access  Private
export const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if already applied
    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Already applied to this job",
      });
    }

    job.applicants.push(req.user.id);
    await job.save();

    const updatedJob = await Job.findById(job._id)
      .populate("postedBy", "name title location avatar")
      .populate("applicants", "name avatar");

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

