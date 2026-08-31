import Pin from "../models/pin.model.js";
import Board from "../models/board.model.js";
import Like from "../models/like.model.js";
import Save from "../models/save.model.js";
import ImageKit from "imagekit";
import sharp from "sharp";

const imagekit = new ImageKit({
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
  urlEndpoint: process.env.IK_URL_ENDPOINT,
});

export const getPins = async (req, res) => {
  const { cursor, search, userId, boardId } = req.query;
  const limit = 21;

  let query = {};
  if (cursor) {
    query._id = { $lt: cursor };
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }
  if (userId) {
    query.user = userId;
  }
  if (boardId) {
    query.board = boardId;
  }

  const pins = await Pin.find(query).sort({ _id: -1 }).limit(limit + 1);

  const hasMore = pins.length > limit;
  const resultPins = hasMore ? pins.slice(0, limit) : pins;
  const nextCursor = hasMore ? resultPins[resultPins.length - 1]._id : null;

  res.status(200).json({ pins: resultPins, nextCursor, hasMore });
};

export const getPin = async (req, res) => {
  const pin = await Pin.findById(req.params.id).populate(
    "user",
    "username displayName img"
  );
  if (!pin) return res.status(404).json("Pin not found!");
  res.status(200).json(pin);
};

export const createPin = async (req, res) => {
  const { title, description, link, board, newBoard, tags, textOptions } =
    req.body;

  if (!req.files?.media) return res.status(400).json("Image is required!");

  const file = req.files.media;
  const metadata = await sharp(file.data).metadata();

  let processedBuffer = file.data;
  if (textOptions) {
    const parsed = JSON.parse(textOptions);
    if (parsed.text) {
      const svgText = `
        <svg width="${metadata.width}" height="${metadata.height}">
          <text
            x="${(parsed.left / 100) * metadata.width}"
            y="${(parsed.top / 100) * metadata.height}"
            font-size="${parsed.fontSize || 32}"
            fill="${parsed.color || '#000000'}"
            font-family="sans-serif"
          >${parsed.text}</text>
        </svg>`;
      processedBuffer = await sharp(file.data)
        .composite([{ input: Buffer.from(svgText), top: 0, left: 0 }])
        .toBuffer();
    }
  }

  const uploadResponse = await imagekit.upload({
    file: processedBuffer,
    fileName: `pin_${Date.now()}`,
    folder: "/pins",
  });

  let boardId = board || null;
  if (newBoard) {
    const createdBoard = await Board.create({
      title: newBoard,
      user: req.userId,
    });
    boardId = createdBoard._id;
  }

  const parsedTags = tags ? tags.split(",").map((t) => t.trim()) : [];

  const newPin = await Pin.create({
    media: uploadResponse.filePath,
    width: metadata.width,
    height: metadata.height,
    title,
    description,
    link: link || undefined,
    board: boardId,
    tags: parsedTags,
    user: req.userId,
  });

  res.status(201).json(newPin);
};

export const interactionCheck = async (req, res) => {
  const pinId = req.params.id;

  let isLiked = false;
  let isSaved = false;

  const token = req.cookies.token;
  if (token) {
    try {
      const jwt = await import("jsonwebtoken");
      const payload = jwt.default.verify(token, process.env.JWT_SECRET);
      const like = await Like.findOne({ pin: pinId, user: payload.id });
      const save = await Save.findOne({ pin: pinId, user: payload.id });
      isLiked = !!like;
      isSaved = !!save;
    } catch (_) {}
  }

  const likeCount = await Like.countDocuments({ pin: pinId });

  res.status(200).json({ isLiked, isSaved, likeCount });
};

export const interact = async (req, res) => {
  const pinId = req.params.id;
  const userId = req.userId;
  const { type } = req.body;

  const Model = type === "like" ? Like : Save;

  const existing = await Model.findOne({ pin: pinId, user: userId });

  if (existing) {
    await Model.findByIdAndDelete(existing._id);
    return res.status(200).json(`${type === "like" ? "Unliked" : "Unsaved"}!`);
  }

  await Model.create({ pin: pinId, user: userId });
  res.status(200).json(`${type === "like" ? "Liked" : "Saved"}!`);
};
