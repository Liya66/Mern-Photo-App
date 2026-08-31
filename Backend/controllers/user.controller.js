import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json("User not found!");

  const { hashedPassword, ...userInfo } = user._doc;

  const followerCount = await Follow.countDocuments({ following: user._id });
  const followingCount = await Follow.countDocuments({ follower: user._id });

  let isFollowing = false;
  const token = req.cookies.token;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const existingFollow = await Follow.findOne({
        follower: payload.id,
        following: user._id,
      });
      isFollowing = !!existingFollow;
    } catch (_) {}
  }

  res.status(200).json({ ...userInfo, followerCount, followingCount, isFollowing });
};

export const registerUser = async (req, res) => {
  const { username, displayName, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) return res.status(409).json("Username or email already exists!");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    displayName,
    email,
    hashedPassword,
  });

  const { hashedPassword: _, ...userInfo } = newUser._doc;

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json(userInfo);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json("User not found!");

  const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordCorrect) return res.status(400).json("Wrong password!");

  const { hashedPassword, ...userInfo } = user._doc;

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(userInfo);
};

export const logoutUser = (req, res) => {
  res.clearCookie("token").status(200).json("Logged out!");
};

export const followUser = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json("User not found!");

  const existingFollow = await Follow.findOne({
    follower: req.userId,
    following: user._id,
  });

  if (existingFollow) {
    await Follow.findByIdAndDelete(existingFollow._id);
    return res.status(200).json("Unfollowed!");
  }

  await Follow.create({ follower: req.userId, following: user._id });
  res.status(200).json("Followed!");
};
