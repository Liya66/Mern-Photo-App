import express from "express";
import {
  getPins,
  getPin,
  createPin,
  interactionCheck,
  interact,
} from "../controllers/pin.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", getPins);
router.post("/", verifyToken, createPin);
router.get("/interaction-check/:id", interactionCheck);
router.post("/interact/:id", verifyToken, interact);
router.get("/:id", getPin);

export default router;
