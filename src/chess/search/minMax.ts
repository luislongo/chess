import { Chess } from "chess.js";

export const minMaxSearch = (
  depth: number,
  chessboard: Chess,
  alpha: number,
  beta: number,
  evaluateFn: (chessboard: Chess) => number
): {
  move: string;
  score: number;
} => {
  if (depth === 0) {
    return {
      move: "",
      score: evaluateFn(chessboard) * (chessboard.turn() === "w" ? 1 : -1),
    };
  }

  const moves = chessboard.moves();
  let bestMove = "";
  let bestScore = -Infinity;

  for (let i = 0; i < moves.length; i++) {
    chessboard.move(moves[i]);

    const score = -minMaxSearch(
      depth - 1,
      chessboard,
      -beta,
      -alpha,
      evaluateFn
    ).score;

    chessboard.undo();

    if (score > bestScore) {
      bestScore = score;
      bestMove = moves[i];
    }

    alpha = Math.max(alpha, score);
    if (alpha >= beta) break;
  }

  return { move: bestMove, score: bestScore };
};
