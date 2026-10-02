import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
  urlEndpoint: process.env.IK_URL_ENDPOINT,
});

const isProduction = process.env.NODE_ENV === "production";

// In production the client and API are on different sites, so the auth cookie
// needs SameSite=None or the browser drops it. Browsers only honor that over
// HTTPS, hence secure. clearCookie must repeat these or the cookie won't clear.
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

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
    .cookie("token", token, { ...cookieOptions, maxAge: TOKEN_MAX_AGE })
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
    .cookie("token", token, { ...cookieOptions, maxAge: TOKEN_MAX_AGE })
    .status(200)
    .json(userInfo);
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", cookieOptions).status(200).json("Logged out!");
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

export const updateUser = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json("User not found!");

  const { displayName } = req.body;
  if (displayName) user.displayName = displayName;

  if (req.files?.img) {
    const file = req.files.img;
    const uploadResponse = await imagekit.upload({
      file: file.data,
      fileName: `avatar_${req.userId}_${Date.now()}`,
      folder: "/avatars",
    });
    user.img = uploadResponse.filePath;
  }

  await user.save();

  const { hashedPassword, ...userInfo } = user._doc;
  res.status(200).json(userInfo);
};
