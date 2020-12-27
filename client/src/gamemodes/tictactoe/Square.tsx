import React, { PureComponent } from "react";
import { TicOptions } from "./TicUtils";

interface Props {
  value: TicOptions;
  onClick: () => void;
}

export class Square extends PureComponent<Props> {
  render(): JSX.Element {
    return (
      <button className="square" onClick={this.props.onClick} type="button">
        {this.props.value}
      </button>
    );
  }
}
