import "./App.css";
import { pieces } from "./chess/constants/pieces";
import { useChessboard } from "./chess/hooks/useChessboard";
import { useMovePiece } from "./chess/hooks/useMovePiece";
import { Board } from "./components/Board/Board";
import { MoveHistory } from "./components/MoveHistory/MoveHistory";

function App() {
  const { chessboard, movePiece, graveyard } = useChessboard();
  const { handleCellClick, turn, moveHistory, selected, legalMoves } =
    useMovePiece(movePiece, chessboard);

  return (
    <div className="panel">
      <div>{graveyard[0]?.map((piece) => pieces[piece.color][piece.type])}</div>
      <Board
        chessboard={chessboard}
        onCellClick={handleCellClick}
        selected={selected}
        legalMoves={legalMoves}
      />
      <div>{graveyard[1]?.map((piece) => pieces[piece.color][piece.type])}</div>
      <div>
        <h2>Turn: {turn}</h2>
        <div>
          <MoveHistory history={moveHistory} />
        </div>
      </div>
    </div>
  );
}

export default App;
