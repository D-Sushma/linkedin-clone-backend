import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for likes count
postSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

// Virtual for comments count
postSchema.virtual("commentsCount").get(function () {
  return this.comments.length;
});

// Virtual for shares count
postSchema.virtual("sharesCount").get(function () {
  return this.shares.length;
});

// Ensure virtuals are included in JSON
postSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Post", postSchema);

