import { pieces } from "../../chess/constants/pieces";
import { Move } from "../../chess/types/Move";
import { Position } from "../../chess/types/Position";
import "./MoveHistory.css";

const cellNameFromPosition = (position: Position) =>
  `${String.fromCharCode(97 + position.col)}${8 - position.row}`;

export type MoveHistoryProps = {
  history: Move[];
};

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  return (
    <div>
      <ul className="move-history-list">
        {history.map(({ from, to, piece }, index) => (
          <li key={index} className="move-history-list-item">
            {index + 1}.<div>{pieces[piece.color][piece.type]}</div>
            <div>{cellNameFromPosition(from)}</div>
            <div>{cellNameFromPosition(to)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
