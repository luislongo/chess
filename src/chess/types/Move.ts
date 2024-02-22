import { Piece } from "./Piece";
import { Position } from "./Position";

export type Move = {
  from: Position;
  to: Position;
  piece: Piece;
};
