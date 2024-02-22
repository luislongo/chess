import { Chessboard } from "./Chessboard";
import { Position } from "./Position";

export type Piece = {
  color: "white" | "black";
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  isMoveLegal: (
    from: Position,
    to: Position,
    chessboard: Chessboard
  ) => boolean;
};

export const pawn = (color: "white" | "black"): Piece => ({
  color,
  type: "pawn",
  isMoveLegal: (from, to, chessboard): boolean => {
    const direction = color === "white" ? -1 : 1;
    const doubleForward =
      from.col === to.col &&
      from.row + 2 * direction === to.row &&
      from.row === (color === "white" ? 6 : 1) &&
      !chessboard[to.row][to.col];

    const forward =
      from.col === to.col &&
      from.row + direction === to.row &&
      !chessboard[to.row][to.col];
    const capture =
      Math.abs(from.col - to.col) === 1 &&
      from.row + direction === to.row &&
      !!chessboard[to.row][to.col] &&
      chessboard[to.row][to.col]?.color !== color;

    return forward || doubleForward || capture;
  },
});

export const rook = (color: "white" | "black"): Piece => ({
  color,
  type: "rook",
  isMoveLegal: (from, to, chessboard): boolean => {
    if (chessboard[to.row][to.col]?.color === color) return false;
    if (from.row !== to.row && from.col !== to.col) return false;
    if (from.row === to.row) {
      const min = Math.min(from.col, to.col);
      const max = Math.max(from.col, to.col);
      for (let i = min + 1; i < max; i++) {
        if (chessboard[from.row][i]) return false;
      }
    } else {
      const min = Math.min(from.row, to.row);
      const max = Math.max(from.row, to.row);
      for (let i = min + 1; i < max; i++) {
        if (chessboard[i][from.col]) return false;
      }
    }
    return true;
  },
});

export const knight = (color: "white" | "black"): Piece => ({
  color,
  type: "knight",
  isMoveLegal: (from, to, chessboard): boolean => {
    if (chessboard[to.row][to.col]?.color === color) return false;
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  },
});

export const bishop = (color: "white" | "black"): Piece => ({
  color,
  type: "bishop",
  isMoveLegal: (from, to, chessboard): boolean => {
    if (chessboard[to.row][to.col]?.color === color) return false;
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    if (rowDiff !== colDiff) return false;

    const rowDirection = from.row < to.row ? 1 : -1;
    const colDirection = from.col < to.col ? 1 : -1;

    for (let i = 1; i < rowDiff; i++) {
      if (chessboard[from.row + i * rowDirection][from.col + i * colDirection])
        return false;
    }

    return true;
  },
});

export const queen = (color: "white" | "black"): Piece => ({
  color,
  type: "queen",
  isMoveLegal: (from, to, chessboard): boolean => {
    return (
      bishop(color).isMoveLegal(from, to, chessboard) ||
      rook(color).isMoveLegal(from, to, chessboard)
    );
  },
});

export const king = (color: "white" | "black"): Piece => ({
  color,
  type: "king",
  isMoveLegal: (from, to, chessboard): boolean => {
    if (chessboard[to.row][to.col]?.color === color) return false;
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return rowDiff <= 1 && colDiff <= 1;
  },
});
