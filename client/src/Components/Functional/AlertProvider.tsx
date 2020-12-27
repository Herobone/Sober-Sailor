import React, { Component, ReactElement } from "react";
import { Alert as IAlert } from "../../helper/AlertTypes";
import { Alert } from "../Visuals/Alert";

interface State {
  errorToDisplay: Map<number, ReactElement>;
  lastIndex: number;
}

interface Props {}

export class AlertProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorToDisplay: new Map<number, ReactElement>(),
      lastIndex: 0,
    };
    this.createAlert = this.createAlert.bind(this);
  }

  createAlert(type: IAlert, message: string | ReactElement, header?: ReactElement): void {
    const { errorToDisplay, lastIndex } = this.state;
    const alertIndex = lastIndex + 1;
    const al = (
      <Alert
        key={`alert${alertIndex}`}
        type={type}
        header={header}
        clear={() => {
          // eslint-disable-next-line react/no-access-state-in-setstate
          const errorToDisplayClear = this.state.errorToDisplay;

          errorToDisplayClear.delete(alertIndex);
          this.setState({
            errorToDisplay: errorToDisplayClear,
          });
        }}
      >
        {message}
      </Alert>
    );
    errorToDisplay.set(alertIndex, al);
    this.setState({
      errorToDisplay,
      lastIndex: alertIndex,
    });
  }

  prepareAlerts(): ReactElement[] {
    const vals: ReactElement[] = [];
    this.state.errorToDisplay.forEach((val: ReactElement): void => {
      vals.push(val);
    });
    return vals;
  }

  render(): JSX.Element {
    return (
      <div>
        <div className="w3-container w3-content">
          <div className="alert-area">{this.prepareAlerts()}</div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
