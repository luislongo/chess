import { Chessboard } from "../types/Chessboard";
import { bishop, king, knight, pawn, queen, rook } from "../types/Piece";

export const initialPosition: Chessboard = [
  [
    rook("black"),
    knight("black"),
    bishop("black"),
    queen("black"),
    king("black"),
    bishop("black"),
    knight("black"),
    rook("black"),
  ],
  Array(8).fill(pawn("black")),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(pawn("white")),
  [
    rook("white"),
    knight("white"),
    bishop("white"),
    queen("white"),
    king("white"),
    bishop("white"),
    knight("white"),
    rook("white"),
  ],
];
