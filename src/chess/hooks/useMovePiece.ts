import { useRef, useState } from "react";
import { Chessboard } from "../types/Chessboard";
import { Move } from "../types/Move";
import { Piece } from "../types/Piece";
import { Position } from "../types/Position";
import { useLegalMoves } from "./useLegalMoves";

export const useMovePiece = (
  movePiece: (from: Position, to: Position) => void,
  chessboard: Chessboard
) => {
  const [selected, setSelected] = useState<
    { pos: Position; piece: Piece } | undefined
  >(undefined);
  const turn = useRef<"white" | "black">("white");
  const moveHistory = useRef<Move[]>([]);

  const { legalMoves, isMoveLegal } = useLegalMoves(selected, chessboard);

  const handleCellClick = (position: Position) => {
    if (selected) {
      if (
        selected.pos.row === position.row &&
        selected.pos.col === position.col
      ) {
        setSelected(undefined);
        return;
      }

      if (isMoveLegal(position)) {
        movePiece(selected.pos, position);
        moveHistory.current.push({
          from: selected.pos,
          to: position,
          piece: selected.piece,
        });
        turn.current = turn.current === "white" ? "black" : "white";
        setSelected(undefined);
      } else {
        setSelected(undefined);
      }
    } else {
      if (
        chessboard[position.row][position.col] !== null &&
        chessboard[position.row][position.col]?.color === turn.current
      ) {
        setSelected({
          pos: position,
          piece: chessboard[position.row][position.col]!,
        });
      }
    }
  };

  return {
    handleCellClick,
    turn: turn.current,
    moveHistory: moveHistory.current,
    selected: selected,
    legalMoves,
  };
};
