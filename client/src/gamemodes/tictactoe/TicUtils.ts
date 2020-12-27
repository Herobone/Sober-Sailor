export type TicOptions = "X" | "O" | undefined;

export class TicUtils {
  static calculateWinner(squares: TicOptions[]): TicOptions {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let winner: TicOptions;
    lines.forEach((line: number[]) => {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        winner = squares[a];
      }
    });
    return winner;
  }
}
