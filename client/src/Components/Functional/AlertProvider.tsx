import React, { Component, ReactElement } from "react";
import { Alert as IAlert } from "../../helper/AlertTypes";
import Alert from "../Visuals/Alert";

interface State {
  errorToDisplay: Map<number, ReactElement>;
  lastIndex: number;
}

interface Props {}

export class AlertProvider extends Component<{}, State> {

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
        key={`alert${  alertIndex}`}
        type={type}
        header={header}
        clear={() => {
          const { errorToDisplay } = this.state;

          errorToDisplay.delete(alertIndex);
          this.setState({
            errorToDisplay,
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
    const fn = (val: ReactElement) => {
      vals.push(val);
    };
    this.state.errorToDisplay.forEach(fn);
    return vals;
  }

  render() {
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
