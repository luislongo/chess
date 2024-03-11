import { Move, Piece, Square } from "chess.js";
import { BoardType } from "./Board";

export type Chessboard = {
  move: (
    move: string | { from: string; to: string; promotion?: string | undefined },
    args_1?: { strict?: boolean | undefined } | undefined
  ) => Move;
  squareColor: (square: Square) => "light" | "dark";
  moves: () => string[];
  fen: () => string;
  board: () => BoardType;
  get: (square: Square) => Piece | null;
};
