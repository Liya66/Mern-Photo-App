import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
  {
    media: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    tags: [String],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Pin", pinSchema);
