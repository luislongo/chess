import { useChessboard } from "./chess/hooks/useChessboard";
import { useGameState } from "./chess/hooks/useGamesState";
import { useRenderer } from "./chess/hooks/useRenderer";
import { InitializeGame } from "./chess/states/InitializeGame";

function App() {
  const { chessboard } = useChessboard();
  const renderer = useRenderer();

  const { onClick } = useGameState(InitializeGame(), {
    chessboard,
    renderer,
  });

  onClick("a1");

  return (
    <div className="absolute left-0 top-0 flex flex-row h-full w-full">
      <div className="flex flex-col items-start" ref={renderer.ref} />
    </div>
  );
}

export default App;
