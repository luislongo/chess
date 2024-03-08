import { RefObject } from "react";
import { BoardType } from "./Board";

export type Renderer = {
  ref: RefObject<HTMLDivElement>;
  initializeBoard: () => void;
  loadBoardState: (board: BoardType) => void;
  onClick: (callback: (square: string) => void) => void;
};
