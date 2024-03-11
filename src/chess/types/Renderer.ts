import { RefObject } from "react";
import { RendererEvents } from "../hooks/useRenderer";
import { BoardType } from "./Board";
import { Square } from "chess.js";

export type Renderer = {
  ref: RefObject<HTMLDivElement>;
  initializeBoard: () => void;
  loadBoardState: (board: BoardType) => void;
  on: <T extends keyof RendererEvents>(
    event: T,
    callback: (event: RendererEvents[T]["payload"]) => void
  ) => string;
  off: (event: keyof RendererEvents, id: string) => void;
  highlightSquare: (square: Square) => void;
  removeHighlight: (square: Square) => void;
  movePiece: ({ from, to }: { from: Square; to: Square }) => void;
};
