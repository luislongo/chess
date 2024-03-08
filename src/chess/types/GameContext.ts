import { Chessboard } from "./Chessboard";
import { GameState } from "./GameState";
import { Renderer } from "./Renderer";

export type GameContext = {
  setState: (newState: GameState) => void;
  chessboard: Chessboard;
  renderer: Renderer;
};
