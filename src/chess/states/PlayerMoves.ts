import { Square } from "chess.js";
import { AIMoves } from "./AIMoves";
import { GameContext } from "../types/GameContext";

export const PlayerMoves = () => {
  let selectedSquare: Square | null = null;

  const onClick = (square: Square, ctx: GameContext) => {
    if (selectedSquare === null) {
      selectedSquare = square;
      return;
    }

    if (selectedSquare === square) {
      ctx.setState(PlayerMoves());
      return;
    }

    if (selectedSquare !== null) {
      try {
        ctx.chessboard.move({
          from: selectedSquare,
          to: square,
          promotion: "q",
        });

        ctx.setState(AIMoves());
      } catch (e) {
        ctx.setState(PlayerMoves());
      }
    }
  };

  return { onClick };
};
