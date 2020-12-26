import {Component, ReactElement} from 'react'
import {Alert as IAlert} from '../../helper/AlertTypes'
import {FormattedMessage} from 'react-intl'

interface Props {
    header?: ReactElement;
    type: IAlert;
    clear?: () => void;
}

interface State {
    shown: boolean
}

class Alert extends Component<Props, State> {
    state = {
        shown: true
    }

    render() {
        return (
            <span>
                {
                    this.state.shown &&
                    <div className={`w3-panel ${this.props.type.color} w3-display-container`}>
                        <span onClick={() => {
                            this.setState({shown: false});
                            if (this.props.clear) {
                                this.props.clear();
                            }
                        }}
                              className="w3-button w3-large w3-display-topright">&times;</span>
                        <h3>
                            {
                                this.props.header &&
                                this.props.header
                            }
                            {
                                !this.props.header &&
                                <FormattedMessage id={this.props.type.defaultHeader}/>
                            }
                        </h3>
                        <p>
                            {this.props.children}
                        </p>
                    </div>
                }
            </span>
        )
    }
}

export default Alert
