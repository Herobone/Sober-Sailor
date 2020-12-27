import React, { Component, ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { Alert as IAlert } from "../../helper/AlertTypes";

interface Props {
  header?: ReactElement;
  type: IAlert;
  clear?: () => void;
}

interface State {
  shown: boolean;
}

export class Alert extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shown: true,
    };
  }

  render():JSX.Element {
    return (
      <span>
        {this.state.shown && (
          <div className={`w3-panel ${this.props.type.color} w3-display-container`}>
            <button
              onClick={() => {
                this.setState({ shown: false });
                if (this.props.clear) {
                  this.props.clear();
                }
              }}
              type="button"
              className="w3-button w3-large w3-display-topright"
            >
              &times;
            </button>
            <h3>
              {this.props.header && this.props.header}
              {!this.props.header && <FormattedMessage id={this.props.type.defaultHeader} />}
            </h3>
            <p>{this.props.children}</p>
          </div>
        )}
      </span>
    );
  }
}
