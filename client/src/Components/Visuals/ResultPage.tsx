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
import { Player } from "../../helper/models/Player";

interface Props {}
interface State {
  result: Player[];
}

export class ResultPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      result: [],
    };

    this.updateResults = this.updateResults.bind(this);
    this.prepareResults = this.prepareResults.bind(this);
  }

  public updateResults(results: Player[]): void {
    this.setState({
      result: results,
    });
  }

  prepareResults(): ReactElement[] {
    const vals: ReactElement[] = [];
    let counter = 1;
    this.state.result.forEach((entry: Player) => {
      vals.push(
        <tr key={`rank${counter}`}>
          <td className="result-rank">{counter}</td>
          <td className="result-nickname">{entry.nickname}</td>
          <td className="result-their-answer">{entry.answer}</td>
          <td className="result-sips">{entry.sips}</td>
        </tr>,
      );
      counter++;
    });

    return vals;
  }

  render(): JSX.Element {
    if (this.state.result.length <= 0) {
      return <div />;
    }

    return (
      <div>
        <h1 className="result-header">
          <FormattedMessage id="elements.results" />
        </h1>
        <table className="result-table">
          <thead>
            <tr>
              <th className="result-header-rank">
                <FormattedMessage id="elements.general.rank" />
              </th>
              <th className="result-header-nickname">
                <FormattedMessage id="general.nickname" />
              </th>
              <th className="result-header-their-answer">
                <FormattedMessage id="general.answer" />
              </th>
              <th className="result-header-sips">
                <FormattedMessage id="general.sips" />
              </th>
            </tr>
          </thead>
          <tbody>{this.prepareResults()}</tbody>
        </table>
      </div>
    );
  }
}
