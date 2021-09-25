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

import { Grid } from "@mui/material";
import React, { ReactElement } from "react";
import { TicOptions } from "sobersailor-common/lib/models/TicTacToe";
import style from "../../css/TicTacToe.module.scss";
import { Square } from "./Square";

interface Props {
    squares: TicOptions[];
    onClick: (i: number) => void;
}

export function Board(props: Props): JSX.Element {
    const renderSquare = (i: number): ReactElement<typeof Square> => {
        return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
    };

    return (
        <Grid container>
            <Grid container item>
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </Grid>
            <Grid container item xs={12}>
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </Grid>
            <Grid container item>
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </Grid>
        </Grid>
    );
}
