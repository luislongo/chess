import { Chessboard } from "../../chess/types/Chessboard";
import { Piece } from "../../chess/types/Piece";
import { Position } from "../../chess/types/Position";
import { PieceComponent } from "../PieceComponent/PieceComponent";
import "./Board.css";

export type BoardProps = {
  chessboard: Chessboard;
  onCellClick: (position: Position) => void;
  selected?: { pos: Position; piece: Piece };
  legalMoves?: Position[];
};

export const Board: React.FC<BoardProps> = ({
  chessboard,
  onCellClick,
  selected,
  legalMoves: validMoves,
}) => {
  const isEven = (num: number) => num % 2 === 0;
  const isSelected = (row: number, col: number) =>
    selected && selected.pos.row === row && selected.pos.col === col;
  const isLegalMove = (row: number, col: number) =>
    validMoves &&
    validMoves.some((move) => move.row === row && move.col === col);

  return (
    <table className="board">
      <tbody>
        {chessboard.map((row, i) => (
          <tr key={i}>
            {row.map((piece, j) => (
              <td
                key={j}
                className={`board-tile ${
                  isEven(i + j) ? "white-tile" : "black-tile"
                } ${isSelected(i, j) ? "selected-tile" : ""}
                ${isLegalMove(i, j) ? "legal-move" : ""}
                `}
                onClick={() => onCellClick({ row: i, col: j })}
              >
                {piece && <PieceComponent {...piece} />}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
