import { pieces } from "../../chess/constants/pieces";
import { Piece } from "../../chess/types/Piece";
import "./Piece.css";
export type PieceComponentProps = Piece;

export function PieceComponent({ color, type }: PieceComponentProps) {
  return <div className="piece">{pieces[color][type]}</div>;
}
