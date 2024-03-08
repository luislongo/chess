import { GameContext } from "../types/GameContext";

export const InitializeGame = () => {
  const onAdd = (ctx: GameContext) => {
    ctx.renderer.initializeBoard();
    ctx.renderer.loadBoardState(ctx.chessboard.board());
    ctx.renderer.onClick((square) => console.log(square));
  };

  return { onAdd };
};
