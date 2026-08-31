import Board from "../models/board.model.js";
import Pin from "../models/pin.model.js";

export const getUserBoards = async (req, res) => {
  const boards = await Board.find({ user: req.params.userId }).sort({
    createdAt: -1,
  });

  const boardsWithDetails = await Promise.all(
    boards.map(async (board) => {
      const pinCount = await Pin.countDocuments({ board: board._id });
      const firstPin = await Pin.findOne({ board: board._id }).sort({
        createdAt: -1,
      });
      return {
        ...board._doc,
        pinCount,
        firstPin: firstPin?.media || null,
      };
    })
  );

  res.status(200).json(boardsWithDetails);
};
