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

interface Props {
  content: Map<number, string>;
  callback: (value: number) => void;
}

interface State {
  xPos: string;
  yPos: string;
  showMenu: boolean;
}

export class ContextMenu extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      xPos: "0px",
      yPos: "0px:",
      showMenu: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener("click", this.handleClick);
    document.addEventListener("contextmenu", this.handleContextMenu);
  }

  componentWillUnmount(): void {
    document.removeEventListener("click", this.handleClick);
    document.removeEventListener("contextmenu", this.handleContextMenu);
  }

  handleClick(): void {
    if (this.state.showMenu) this.setState({ showMenu: false });
  }

  handleContextMenuClick(e: number): void {
    this.props.callback(e);
  }

  handleContextMenu(e: MouseEvent): void {
    e.preventDefault();

    this.setState({
      xPos: `${e.pageX}px`,
      yPos: `${e.pageY}px`,
      showMenu: true,
    });
  }

  render(): JSX.Element | null {
    const { showMenu, yPos, xPos } = this.state;
    if (showMenu) {
      const vals: ReactElement[] = [];
      this.props.content.forEach((element: string, key: number) => {
        vals.push(
          <li key={`contextmenu${element}`} className="w3-bar-item w3-button">
            <button onClick={() => this.handleContextMenuClick(key)} type="submit">
              <FormattedMessage id={element} />
            </button>
          </li>,
        );
      });
      return (
        <ul
          className="w3-block w3-black w3-dropdown-content w3-bar-block w3-border hb-context-menu"
          style={{
            top: yPos,
            left: xPos,
          }}
        >
          {vals}
        </ul>
      );
    }
    return null;
  }
}
