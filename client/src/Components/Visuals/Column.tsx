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

import React, { PureComponent } from "react";

interface ColumnProps {
  additionalClasses?: string;
}

export class Column extends PureComponent<ColumnProps> {
  render(): JSX.Element {
    const topLevelClass = `w3-col ${this.props.additionalClasses}`;
    return (
      <div className={topLevelClass}>
        <div className="w3-card w3-round w3-white w3-container">{this.props.children}</div>
      </div>
    );
  }
}
