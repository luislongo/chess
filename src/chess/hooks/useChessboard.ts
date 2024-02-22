import { useState } from "react";
import { Chessboard } from "../types/Chessboard";
import { Position } from "../types/Position";
import { initialPosition } from "../constants/initialPosition";
import { Piece } from "../types/Piece";

export const useChessboard = () => {
  const [chessboard, setChessboard] = useState<Chessboard>(initialPosition);
  const [graveyard, setGraveyard] = useState<Piece[][]>([[], []]);

  const movePiece = (from: Position, to: Position) => {
    const fromPiece = chessboard[from.row][from.col];
    const toPiece = chessboard[to.row][to.col];

    setChessboard((prev) => {
      const newChessboard = prev.map((row) => row.slice());
      newChessboard[to.row][to.col] = fromPiece;
      newChessboard[from.row][from.col] = null;
      return newChessboard;
    });

    if (toPiece) {
      setGraveyard((prev) => {
        const newGraveyard = prev.map((row) => row.slice());
        newGraveyard[toPiece.color === "white" ? 0 : 1].push(toPiece);
        return newGraveyard;
      });
    }
  };

  return { chessboard, movePiece, graveyard };
};
