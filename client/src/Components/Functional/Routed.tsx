// eslint-disable-next-line no-use-before-define
import React, { PureComponent, ReactElement } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Settings } from "../Sites/Settings";
import { Alert } from "../../helper/AlertTypes";
import { Login } from "../Sites/Login";
import { Logout } from "./Logout";
import { Home } from "../Sites/Home";
import { Mixed } from "../Sites/Gamemodes/Mixed";
import { TruthOrDare } from "../Sites/Gamemodes/TruthOrDare";
import { Saufpoly } from "../Sites/Gamemodes/Saufpoly";
import { GameProvider } from "./GameProvider";
import { TicTacToe } from "../../gamemodes/tictactoe/TicTacToe";

interface Props {
  changeLanguage: (locale: string) => void;
  currentLocale: string;
  createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

export class Routed extends PureComponent<Props> {
  render(): JSX.Element {
    return (
      <div className="w3-container">
        <Router>
          <Switch>
            <Route
              path="/mixed/:gameID"
              render={(props) => (
                <GameProvider createAlert={this.props.createAlert} gameID={props.match.params.gameID}>
                  <Mixed createAlert={this.props.createAlert} gameID={props.match.params.gameID} />
                </GameProvider>
              )}
            />
            <Route
              path="/truthordare/:gameID"
              render={(props) => (
                <GameProvider createAlert={this.props.createAlert} gameID={props.match.params.gameID}>
                  <TruthOrDare createAlert={this.props.createAlert} gameID={props.match.params.gameID} />
                </GameProvider>
              )}
            />

            <Route
              path="/saufpoly/:gameID"
              render={(props) => (
                <GameProvider createAlert={this.props.createAlert} gameID={props.match.params.gameID}>
                  <Saufpoly createAlert={this.props.createAlert} gameID={props.match.params.gameID} />
                </GameProvider>
              )}
            />
            <Route path="/mixed" render={() => <GameProvider createAlert={this.props.createAlert} gameURL="mixed" />} />
            <Route
              path="/truthordare"
              render={() => <GameProvider createAlert={this.props.createAlert} gameURL="truthordare" />}
            />
            <Route
              path="/saufpoly"
              render={() => <GameProvider createAlert={this.props.createAlert} gameURL="saufpoly" />}
            />

            <Route path="/ttt">
              <TicTacToe />
            </Route>

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
              <Home createAlert={this.props.createAlert} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
