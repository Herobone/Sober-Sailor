import React, { Component, ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { Player } from "../../helper/models/Player";

interface Props {}
interface State {
  result: Player[];
}

export default class ResultPage extends Component<Props, State> {
  state = {
    result: [],
  };

  constructor(props: Props) {
    super(props);
    this.updateResults = this.updateResults.bind(this);
    this.prepareResults = this.prepareResults.bind(this);
  }

  public updateResults(results: Player[]) {
    this.setState({
      result: results,
    });
  }

  prepareResults() {
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

  render() {
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
