import Message from "../models/message.model.js";

// @desc    Get all conversations for current user
// @route   GET /api/messages
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .sort({ createdAt: -1 });

    // Group messages by conversation partner
    const conversations = {};
    messages.forEach((message) => {
      const partnerId =
        message.sender._id.toString() === req.user.id
          ? message.receiver._id.toString()
          : message.sender._id.toString();

      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partner:
            message.sender._id.toString() === req.user.id
              ? message.receiver
              : message.sender,
          lastMessage: message,
          unreadCount: 0,
        };
      }

      if (
        !message.read &&
        message.receiver._id.toString() === req.user.id
      ) {
        conversations[partnerId].unreadCount++;
      }
    });

    res.status(200).json({
      success: true,
      count: Object.keys(conversations).length,
      data: Object.values(conversations),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        sender: req.params.userId,
        receiver: req.user.id,
        read: false,
      },
      {
        read: true,
        readAt: Date.now(),
      }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide receiver and content",
      });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar");

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Make sure user is the receiver
    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    message.read = true;
    message.readAt = Date.now();
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

