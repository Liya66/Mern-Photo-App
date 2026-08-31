import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Pin from "../models/pin.model.js";
import Board from "../models/board.model.js";
import Comment from "../models/comment.model.js";

const MONGO = process.env.MONGO || "mongodb://localhost:27017/pinterest";

const users = [
  { displayName: "Joss Donna", username: "jossdonna", email: "joss@test.com" },
  { displayName: "Li Hua", username: "lihua", email: "lihua@test.com" },
  { displayName: "Emma Wilson", username: "emmaw", email: "emma@test.com" },
  { displayName: "Alex Chen", username: "alexchen", email: "alex@test.com" },
  { displayName: "Sara Kim", username: "sarakim", email: "sara@test.com" },
];

const boardNames = [
  "Nature Vibes", "Architecture", "Food & Recipes",
  "Travel Dreams", "Art Inspo", "Fashion",
  "Interior Design", "Photography", "Minimalist",
  "Vintage Finds",
];

const pinTitles = [
  "Golden hour at the beach", "Mountain reflections", "City skyline at night",
  "Cozy cabin retreat", "Street art in Brooklyn", "Morning coffee ritual",
  "Japanese garden", "Vintage car collection", "Sunset over the lake",
  "Autumn forest walk", "Rooftop terrace view", "Desert landscape",
  "Floral arrangement", "Modern kitchen design", "Old bookshop charm",
  "Rainy day in Paris", "Ceramic pottery studio", "Ocean waves",
  "Rustic farmhouse", "Neon lights downtown",
];

const comments = [
  "This is so beautiful!",
  "Love the colors in this one",
  "Where was this taken?",
  "Adding this to my inspiration board",
  "Absolutely stunning!",
  "The lighting is perfect",
  "Need to visit this place",
  "Such a creative shot",
  "This makes me so happy",
  "Wow, just wow!",
];

const seed = async () => {
  await mongoose.connect(MONGO);
  console.log("Connected to MongoDB for seeding...");

  await Promise.all([
    User.deleteMany({}),
    Pin.deleteMany({}),
    Board.deleteMany({}),
    Comment.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash("password123", 10);

  const createdUsers = await User.insertMany(
    users.map((u) => ({ ...u, hashedPassword }))
  );
  console.log(`Created ${createdUsers.length} users`);

  const createdBoards = await Board.insertMany(
    boardNames.map((title, i) => ({
      title,
      user: createdUsers[i % createdUsers.length]._id,
    }))
  );
  console.log(`Created ${createdBoards.length} boards`);

  const pins = [];
  for (let i = 1; i <= 25; i++) {
    const ext = i <= 1 ? "heic" : i <= 3 || i === 25 || i === 26 ? "jpg" : "JPG";
    pins.push({
      media: `/pins/pin${i}.${ext}`,
      width: 1250,
      height: 600 + Math.floor(Math.random() * 1200),
      title: pinTitles[i % pinTitles.length],
      description: `A beautiful pin — ${pinTitles[i % pinTitles.length].toLowerCase()}.`,
      board: createdBoards[i % createdBoards.length]._id,
      tags: ["photography", "inspiration"],
      user: createdUsers[i % createdUsers.length]._id,
    });
  }
  const createdPins = await Pin.insertMany(pins);
  console.log(`Created ${createdPins.length} pins`);

  const commentDocs = [];
  for (let i = 0; i < 50; i++) {
    commentDocs.push({
      description: comments[i % comments.length],
      pin: createdPins[i % createdPins.length]._id,
      user: createdUsers[i % createdUsers.length]._id,
    });
  }
  await Comment.insertMany(commentDocs);
  console.log(`Created ${commentDocs.length} comments`);

  console.log("\nSeed complete! All users have password: password123");
  console.log("Test login: joss@test.com / password123");

  await mongoose.disconnect();
};

seed().catch(console.error);
