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
import Mixed from "../Sites/Gamemodes/Mixed";
import TruthOrDare from "../Sites/Gamemodes/TruthOrDare";
import Saufpoly from "../Sites/Gamemodes/Saufpoly";

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
            <div className="w3-container">
                <Router>
                    <Switch>
                        <Route path="/mixed" render={() => <Mixed createAlert={this.props.createAlert} /> } />
                        <Route path="/mixed/:gameID" render={props => <Mixed createAlert={this.props.createAlert} gameID={props.match.params.gameID} /> } />

                        <Route path="/truthordare" render={() => <TruthOrDare createAlert={this.props.createAlert} /> } />
                        <Route path="/truthordare/:gameID" render={props => <TruthOrDare createAlert={this.props.createAlert} gameID={props.match.params.gameID} /> } />

                        <Route path="/saufpoly" render={() => <Saufpoly createAlert={this.props.createAlert} /> } />
                        <Route path="/saufpoly/:gameID" render={props => <Saufpoly createAlert={this.props.createAlert} gameID={props.match.params.gameID} /> } />

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
            </div>
        )
    }
}

export default Routed;
