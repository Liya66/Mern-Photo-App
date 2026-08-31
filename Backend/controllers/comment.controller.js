import Comment from "../models/comment.model.js";

export const getPostComments = async (req, res) => {
  const comments = await Comment.find({ pin: req.params.postId })
    .populate("user", "username displayName img")
    .sort({ createdAt: -1 });
  res.status(200).json(comments);
};

export const addComment = async (req, res) => {
  const newComment = await Comment.create({
    description: req.body.description,
    pin: req.body.pin,
    user: req.userId,
  });

  const populated = await newComment.populate("user", "username displayName img");
  res.status(201).json(populated);
};
