import { Chess, Square } from "chess.js";
import { useRef, useState } from "react";
import { Chessboard } from "../types/Chessboard";

export const useChessboard = () => {
  const chess = useRef(new Chess());
  const ref = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState(chess.current.board());

  return {
    board,
    chessboard: {
      move: (move, args_1) => {
        setBoard(chess.current.board());
        return chess.current.move(move, args_1);
      },
      squareColor: (square: Square) => {
        return chess.current.squareColor(square);
      },
      moves: () => {
        return chess.current.moves();
      },
      fen: () => {
        return chess.current.fen();
      },
      board: () => {
        return chess.current.board();
      },
      get: (square: Square) => {
        return chess.current.get(square);
      },
    } as Chessboard,
    ref,
  };
};
