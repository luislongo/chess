import { Chess } from "chess.js";
import { GameContext } from "../types/GameContext";
import { PlayerSelectsPiece } from "./PlayerMoves";
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
    const moveObj = ctx.chessboard.move(move);
    ctx.renderer.movePiece({
      from: moveObj.from,
      to: moveObj.to,
    });
    ctx.setState(PlayerSelectsPiece());
  };

  return { onAdd };
};
