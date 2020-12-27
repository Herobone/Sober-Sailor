/** ***************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { Component, ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { GameManager } from "../../helper/gameManager";
import { playerConverter } from "../../helper/models/Player";

interface Props {
  gameID: string;
}

interface State {
  leaderboard: Map<string, number>;
}

export class Leaderboard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      leaderboard: new Map<string, number>(),
    };
    this.updateLeaderboard = this.updateLeaderboard.bind(this);
    this.prepareLeaderboard = this.prepareLeaderboard.bind(this);
  }

  updateLeaderboard(): void {
    const lead = GameManager.getGameByID(this.props.gameID)
      .collection("players")
      .withConverter(playerConverter)
      .orderBy("sips", "desc");
    const leaderboard = new Map<string, number>();
    lead
      .get()
      .then((query) => {
        query.forEach((doc) => {
          const data = doc.data();
          if (data && doc.id !== "register") {
            leaderboard.set(data.nickname, data.sips);
          }
        });
        this.setState({
          leaderboard,
        });
        return Promise.resolve();
      })
      .catch(console.error);
  }

  prepareLeaderboard(): ReactElement[] {
    const vals: ReactElement[] = [];
    let counter = 1;
    this.state.leaderboard.forEach((value: number, key: string) => {
      vals.push(
        <tr key={`leaderboard${counter}`}>
          <td className="leaderboard-place">{counter}</td>
          <td className="leaderboard-nickname">{key}</td>
          <td className="leaderboard-score">{value}</td>
        </tr>,
      );
      counter++;
    });

    return vals;
  }

  render(): JSX.Element {
    return (
      <div>
        <h1 className="leaderboard-header">
          <FormattedMessage id="elements.leaderboard" />
        </h1>
        <table className="leaderboard">
          <thead>
            <tr>
              <th className="leaderboard-header-rank">
                <FormattedMessage id="elements.general.rank" />
              </th>
              <th className="leaderboard-header-nickname">
                <FormattedMessage id="general.nickname" />
              </th>
              <th className="leaderboard-header-score">
                <FormattedMessage id="general.sips" />
              </th>
            </tr>
          </thead>
          <tbody>{this.prepareLeaderboard()}</tbody>
        </table>
      </div>
    );
  }
}
