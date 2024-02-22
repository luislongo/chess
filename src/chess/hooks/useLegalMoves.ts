import { useMemo } from "react";
import { Chessboard } from "../types/Chessboard";
import { Piece } from "../types/Piece";
import { Position } from "../types/Position";

export const useLegalMoves = (
  selected: { pos: Position; piece: Piece } | undefined,
  chessboard: Chessboard
) => {
  const legalMoves = useMemo(() => {
    if (!selected) return [];
    const piece = selected.piece;
    const moves: Position[] = [];
    for (let i = 0; i < chessboard.length; i++) {
      for (let j = 0; j < chessboard[i].length; j++) {
        if (
          piece &&
          piece?.isMoveLegal?.(
            selected.pos,
            {
              row: i,
              col: j,
            },
            chessboard
          )
        ) {
          moves.push({ row: i, col: j });
        }
      }
    }
    return moves;
  }, [selected, chessboard]);

  const isMoveLegal = (to: Position) => {
    if (!selected) return false;
    return legalMoves.some(
      (move) => move.row === to.row && move.col === to.col
    );
  };

  return { legalMoves, isMoveLegal };
};
