import React, { PureComponent, ReactElement } from "react";
import { Square } from "./Square";
import { TicOptions } from "./TicUtils";

interface Props {
  squares: TicOptions[];
  onClick: (i: number) => void;
}

export class Board extends PureComponent<Props> {
  renderSquare(i: number): ReactElement<Square> {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render(): JSX.Element {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
