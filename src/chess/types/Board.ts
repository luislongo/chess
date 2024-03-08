import { Square, PieceSymbol, Color } from "chess.js";

export type BoardType = ({
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null)[][];
