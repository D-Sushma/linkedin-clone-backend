import User from "../models/user.model.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    // Make sure user can only update their own profile
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user connections
// @route   GET /api/users/:id/connections
// @access  Public
export const getUserConnections = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("connectionsList", "name title location avatar")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      count: user.connectionsList.length,
      data: user.connectionsList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send connection request
// @route   POST /api/users/:id/connect
// @access  Private
export const sendConnectionRequest = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot connect to yourself",
      });
    }

    // Check if already connected
    if (currentUser.connectionsList.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Already connected",
      });
    }

    // Check if request already sent
    if (targetUser.pendingConnections.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Connection request already sent",
      });
    }

    // Add to pending connections
    targetUser.pendingConnections.push(req.user.id);
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: "Connection request sent",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept connection request
// @route   PUT /api/users/:id/accept
// @access  Private
export const acceptConnectionRequest = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const requesterUser = await User.findById(req.params.id);

    if (!requesterUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if request exists
    if (!currentUser.pendingConnections.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "No pending connection request from this user",
      });
    }

    // Remove from pending and add to connections
    currentUser.pendingConnections = currentUser.pendingConnections.filter(
      (id) => id.toString() !== req.params.id.toString()
    );
    currentUser.connectionsList.push(req.params.id);
    currentUser.connections = currentUser.connectionsList.length;

    requesterUser.connectionsList.push(req.user.id);
    requesterUser.connections = requesterUser.connectionsList.length;

    await currentUser.save();
    await requesterUser.save();

    res.status(200).json({
      success: true,
      message: "Connection request accepted",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get people you may know
// @route   GET /api/users/suggestions
// @access  Private
export const getSuggestions = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Get users who are not already connected or pending
    const suggestions = await User.find({
      _id: {
        $ne: req.user.id,
        $nin: [
          ...currentUser.connectionsList,
          ...currentUser.pendingConnections,
        ],
      },
    })
      .select("name title location avatar connections")
      .limit(10);

    res.status(200).json({
      success: true,
      count: suggestions.length,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};

