import { Square } from "chess.js";
import { GameContext } from "../types/GameContext";
import { AIMoves } from "./AIMoves";

export const PlayerSelectsPiece = () => {
  let mouseEnterCallbackId = "";
  let mouseLeaveCallbackId = "";
  let clickCallbackId = "";

  const onAdd = (ctx: GameContext) => {
    clickCallbackId = ctx.renderer.on("click", (square) => {
      const piece = ctx.chessboard.get(square);

      if (piece) {
        ctx.setState(PlayerMovesPiece(square)());
      }
    });
    mouseEnterCallbackId = ctx.renderer.on("onMouseEnter", (square) => {
      ctx.renderer.highlightSquare(square);
    });
    mouseLeaveCallbackId = ctx.renderer.on("onMouseLeave", (square) => {
      ctx.renderer.removeHighlight(square);
    });
  };

  const onRemove = (ctx: GameContext) => {
    ctx.renderer.off("click", clickCallbackId);
    ctx.renderer.off("onMouseEnter", mouseEnterCallbackId);
    ctx.renderer.off("onMouseLeave", mouseLeaveCallbackId);
  };

  return { onAdd, onRemove };
};

export const PlayerMovesPiece = (square: Square) => () => {
  let clickCallbackId = "";

  const onAdd = (ctx: GameContext) => {
    ctx.renderer.highlightSquare(square);

    clickCallbackId = ctx.renderer.on("click", (sq: Square) => {
      if (sq === square) {
        ctx.setState(PlayerSelectsPiece());
      }

      if (sq !== square) {
        try {
          ctx.chessboard.move({
            from: square,
            to: sq,
          });

          ctx.renderer.movePiece({
            from: square,
            to: sq,
          });

          ctx.setState(AIMoves());
          ctx.renderer.removeHighlight(square);
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  const onRemove = (ctx: GameContext) => {
    ctx.renderer.off("click", clickCallbackId);
    ctx.renderer.removeHighlight(square);
  };

  return {
    onAdd,
    onRemove,
  };
};
