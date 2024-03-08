import { Square } from "chess.js";
import { PieceComponent } from "../PieceComponent/PieceComponent";
import { BoardType } from "../../chess/types/Board";

export type BoardProps = {
  board: BoardType;
  squareColor: (square: Square) => "light" | "dark" | null;
  onClick?: (square: Square) => void;
  selectedSquare?: Square;
  validMoves?: Square[];
};

export const Board: React.FC<BoardProps> = ({
  board,
  onClick,
  squareColor,
  selectedSquare,
  validMoves,
}) => {
  return (
    <table className="h-5/6 w-auto aspect-square">
      <tbody>
        {board.map((row, i) => (
          <tr key={i} className="">
            {row.map((piece, j) => {
              //Convert the row and column to a square name
              const squareName = (String.fromCharCode(97 + j) +
                (8 - i)) as Square;

              return (
                <td
                  key={j}
                  className={`
                  w-8 h-8 relative ${
                    selectedSquare === squareName
                      ? "bg-blue-500"
                      : validMoves?.includes(squareName)
                      ? "bg-green-500"
                      : squareColor(squareName) === "light"
                      ? "bg-gray-300"
                      : "bg-gray-500"
                  }
              `}
                  onClick={() => onClick?.(squareName)}
                >
                  {piece && (
                    <PieceComponent type={piece.type} color={piece.color} />
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
