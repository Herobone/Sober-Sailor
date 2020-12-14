import React, { Component, ReactElement } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Settings from '../Sites/Settings';
import {Alert} from '../../helper/AlertTypes';
import Login from '../Sites/Login';
import Logout from './Logout';
import Home from "../Sites/Home";

interface Props {
    changeLanguage: (locale: string) => void;
    currentLocale: string;
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

interface State {
    locale: string;
}

export class Routed extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            locale: navigator.language
        }
    }

    render() {
        return (
            <Router>

                <Switch>
                    <Route path="/login">
                        <Login createAlert={this.props.createAlert} />
                    </Route>

                    <Route path="/logout">
                        <Logout createAlert={this.props.createAlert} />
                    </Route>

                    <Route path="/settings">
                        <Settings
                            changeLanguage={this.props.changeLanguage}
                            currentLocale={this.props.currentLocale}
                            createAlert={this.props.createAlert}
                        />
                    </Route>

                    <Route path="/">
                        <Home createAlert={this.props.createAlert}/>
                    </Route>
                </Switch>
            </Router >
        )
    }
}

export default Routed;
