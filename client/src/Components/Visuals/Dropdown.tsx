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

import React, { Component, ReactElement, RefObject } from "react";
import { FormattedMessage } from "react-intl";

interface Props {
  content: Map<string, string>;
  callback: (value: string) => void;
  selected?: string;
}

interface State {
  selected: string | undefined;
}

export class Dropdown extends Component<Props, State> {
  ref: RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.ref = React.createRef();
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);

    this.state = {
      selected: this.props.selected ? this.props.content.get(this.props.selected) : undefined,
    };
  }

  toggleDropdown(): void {
    if (this.ref.current) {
      const cur = this.ref.current;
      if (!cur.className.includes("w3-show")) {
        cur.className += " w3-show";
      } else {
        cur.className = cur.className.replace(" w3-show", "");
      }
    }
  }

  handleDropdownClick(e: string, element: string): void {
    this.props.callback(e);
    this.closeDropdown();
    this.setState({
      selected: element,
    });
  }

  closeDropdown(): void {
    if (this.ref.current) {
      const cur = this.ref.current;
      cur.className = cur.className.replace(" w3-show", "");
    }
  }

  render(): JSX.Element {
    const vals: ReactElement[] = [];
    this.props.content.forEach((element: string, key: string) => {
      vals.push(
        <button
          // eslint-disable-next-line react/no-array-index-key
          key={`dropdown${key}`}
          type="submit"
          onClick={() => this.handleDropdownClick(key, element)}
          className="w3-bar-item w3-button"
        >
          {element}
        </button>,
      );
    });
    return (
      <div className="w3-block w3-black">
        <button onClick={this.toggleDropdown} className="w3-button w3-black" type="button">
          {this.state.selected && this.state.selected}
          {!this.state.selected && <FormattedMessage id="elements.dropdown.select" />}{" "}
          <i className="fa fa-chevron-circle-down" aria-hidden="true" />
        </button>
        <div id="language-dropdown" ref={this.ref} className="w3-dropdown-content w3-bar-block w3-border">
          {vals}
        </div>
      </div>
    );
  }
}
