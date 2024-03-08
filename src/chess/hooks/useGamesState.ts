import { Square } from "chess.js";
import { useEffect, useRef } from "react";
import { Chessboard } from "../types/Chessboard";
import { GameState } from "../types/GameState";
import { Renderer } from "../types/Renderer";

export const useGameState = (
  initialState: GameState,
  ctx: {
    chessboard: Chessboard;
    renderer: Renderer;
  }
) => {
  const state = useRef(initialState);

  useEffect(() => {
    state.current.onAdd?.({ setState, ...ctx });
  }, []);

  const setState = (newState: GameState) => {
    state.current.onRemove?.({ setState, ...ctx });
    state.current = newState;
    newState.onAdd?.({ setState, ...ctx });
  };

  const onClick = (square: Square) => {
    state.current.onClick?.(square, { setState, ...ctx });
  };

  return { onClick };
};
