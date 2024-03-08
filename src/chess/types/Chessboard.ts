import { Square } from "chess.js";
import { BoardType } from "./Board";

export type Chessboard = {
  move: (
    move: string | { from: string; to: string; promotion?: string | undefined },
    args_1?: { strict?: boolean | undefined } | undefined
  ) => void;
  squareColor: (square: Square) => "light" | "dark";
  moves: () => string[];
  fen: () => string;
  board: () => BoardType;
};
