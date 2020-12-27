import React, { Component } from "react";
import { Board } from "./Board";
import "../../css/TicTacToe.css";
import { TicOptions, TicUtils } from "./TicUtils";

interface Props {}
interface State {
  squares: TicOptions[];
  stepNumber: number;
  xIsNext: boolean;
}

export class TicTacToe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      squares: new Array(9),
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i: number): void {
    const { squares } = this.state;
    if (TicUtils.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState((prev) => {
      return {
        squares,
        stepNumber: prev.stepNumber + 1,
        xIsNext: !prev.xIsNext,
      };
    });
  }

  render(): JSX.Element {
    const { squares } = this.state;
    const winner = TicUtils.calculateWinner(squares);

    const status = winner ? `Winner: ${winner}` : `Next player: ${this.state.xIsNext ? "X" : "O"}`;

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <div
        className="game"
        onKeyPressCapture={(event) => {
          const num = Number.parseInt(event.key, 10);
          if (num < 10 && num > 0) this.handleClick(num - 1);
        }}
        role="application"
      >
        <div className="game-board">
          <Board squares={squares} onClick={(i: number) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
      </div>
    );
  }
}
