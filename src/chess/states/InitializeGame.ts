import { GameContext } from "../types/GameContext";
import { PlayerSelectsPiece } from "./PlayerMoves";

export const InitializeGame = () => {
  let callbackId: string | null = null;

  const onAdd = (ctx: GameContext) => {
    ctx.renderer.initializeBoard();
    ctx.renderer.loadBoardState(ctx.chessboard.board());
    callbackId = ctx.renderer.on("click", (square) => console.log(square));
    ctx.setState(PlayerSelectsPiece());
  };

  const onRemove = (ctx: GameContext) => {
    if (callbackId) {
      ctx.renderer.off("click", callbackId);
    }
  };

  return { onAdd, onRemove };
};
