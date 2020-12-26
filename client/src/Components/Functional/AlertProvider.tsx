import {Component, ReactElement} from 'react';
import {Alert as IAlert} from '../../helper/AlertTypes';
import Alert from '../../Components/Visuals/Alert';

interface Props {

}

interface State {
    errorToDisplay: Map<number, ReactElement>;
    lastIndex: number;
}

export default class AlertProvider extends Component<Props, State> {
    state = {
        errorToDisplay: new Map<number, ReactElement>(),
        lastIndex: 0,
    }

    constructor(props: Props) {
        super(props);
        this.createAlert = this.createAlert.bind(this);
    }

    createAlert(type: IAlert, message: string | ReactElement, header?: ReactElement) {

        const {errorToDisplay, lastIndex} = this.state;
        const alertIndex = lastIndex + 1;
        const al = (
            <Alert
                key={"alert" + alertIndex}
                type={type}
                header={header}
                clear={() => {
                    const {errorToDisplay} = this.state;

                    errorToDisplay.delete(alertIndex);
                    this.setState({
                        errorToDisplay: errorToDisplay
                    });
                }}>
                {message}
            </Alert>
        )
        errorToDisplay.set(alertIndex, al);
        this.setState({
            errorToDisplay: errorToDisplay,
            lastIndex: alertIndex
        });
    }

    prepareAlerts(): ReactElement[] {
        let vals: ReactElement[] = [];
        const fn = (val: ReactElement) => {
            vals.push(val)
        }
        this.state.errorToDisplay.forEach(fn);
        return vals;
    }

    render() {
        return (
            <div>
                <div className="w3-container w3-content">
                    <div className="alert-area">
                        {this.prepareAlerts()}
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}
