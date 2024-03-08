import { Chess } from "chess.js";
import { GameContext } from "../types/GameContext";
import { PlayerMoves } from "./PlayerMoves";
import { minMaxSearch } from "../search/minMax";
import { evaluateBoard } from "../search/evaluateBoard";

export const AIMoves = () => {
  const onAdd = (ctx: GameContext) => {
    const { move } = minMaxSearch(
      3,
      new Chess(ctx.chessboard.fen()),
      -Infinity,
      Infinity,
      evaluateBoard
    );
    ctx.chessboard.move(move);
    ctx.setState(PlayerMoves());
  };

  return { onAdd };
};
