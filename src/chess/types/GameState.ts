import { Square } from "chess.js";
import { GameContext } from "./GameContext";

export type GameState = {
  onClick?: (square: Square, ctx: GameContext) => void;
  onAdd?: (ctx: GameContext) => void;
  onRemove?: (ctx: GameContext) => void;
};
