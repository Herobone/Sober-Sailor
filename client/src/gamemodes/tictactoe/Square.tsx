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

import React from "react";
import { TicOptions } from "sobersailor-common/lib/models/TicTacToe";
import style from "../../css/TicTacToe.module.scss";

interface Props {
    value: TicOptions;
    onClick: () => void;
}

export function Square(props: Props): JSX.Element {
    return (
        <button className={style.square} onClick={props.onClick} type="button">
            {props.value}
        </button>
    );
}
