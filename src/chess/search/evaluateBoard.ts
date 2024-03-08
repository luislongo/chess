import { Chess } from "chess.js";

export const evaluateBoard = (chessboard: Chess) => {
  if (chessboard.isCheckmate())
    return -Infinity * (chessboard.turn() === "w" ? 1 : -1);
  if (chessboard.isStalemate()) return 0;
  if (chessboard.isInsufficientMaterial()) return 0;

  const board = chessboard.board();
  const turn = chessboard.turn();
  let score = 0;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece === null) continue;

      const value = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 0,
      }[piece.type];

      score += piece.color === turn ? value : -value;

      if (piece.type === "p" && piece.color === "w") {
        score += 0.1 * (8 - i);
      }

      if (piece.type === "p" && piece.color === "b") {
        score -= 0.1 * i;
      }

      //Control the center
      if (i === 3 || i === 4) {
        if (j === 3 || j === 4) {
          score += 0.1 * (piece.color === "w" ? 1 : -1);
        }
      }

      if (i === 2 || i === 5) {
        if (j === 2 || j === 5) {
          score += 0.05 * (piece.color === "w" ? 1 : -1);
        }
      }

      //King safety

      if (piece.type === "k") {
        const kingSafety = {
          w: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, -0.1, -0.1, -0.1, -0.1, 0, 0],
            [0, -0.1, -0.2, -0.2, -0.2, -0.2, -0.1, 0],
            [0, -0.2, -0.2, -0.3, -0.3, -0.2, -0.2, 0],
            [0, -0.2, -0.3, -0.3, -0.3, -0.3, -0.2, 0],
            [0, -0.2, -0.2, -0.3, -0.3, -0.2, -0.2, 0],
            [0, -0.1, -0.2, -0.2, -0.2, -0.2, -0.1, 0],
            [0, 0, -0.1, -0.1, -0.1, -0.1, 0, 0],
          ],
          b: [
            [0, 0, -0.1, -0.1, -0.1, -0.1, 0, 0],
            [0, -0.1, -0.2, -0.2, -0.2, -0.2, -0.1, 0],
            [0, -0.2, -0.2, -0.3, -0.3, -0.2, -0.2, 0],
            [0, -0.2, -0.3, -0.3, -0.3, -0.3, -0.2, 0],
            [0, -0.2, -0.2, -0.3, -0.3, -0.2, -0.2, 0],
            [0, -0.2, -0.2, -0.3, -0.3, -0.2, -0.2, 0],
            [0, -0.1, -0.2, -0.2, -0.2, -0.2, -0.1, 0],
            [0, 0, -0.1, -0.1, -0.1, -0.1, 0, 0],
          ],
        };

        score += kingSafety[piece.color][i][j];
      }
    }
  }

  return score;
};
