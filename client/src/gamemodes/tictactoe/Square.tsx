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

import { Theme, useMediaQuery } from "@mui/material";
import React, { CSSProperties, useEffect, useState } from "react";
import { TicOptions } from "sobersailor-common/lib/models/TicTacToe";
import style from "../../css/TicTacToe.module.scss";

interface Props {
    value: TicOptions;
    onClick: () => void;
}

export function Square(props: Props): JSX.Element {
    const matchesMedium = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
    const matchesLarge = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

    const getCSS = (size: number): CSSProperties => {
        const sizeString = `${size}vw`;
        return {
            fontSize: sizeString,
            lineHeight: sizeString,
            height: sizeString,
            width: sizeString,
        };
    };
    const smallScreen = getCSS(22);
    const mediumScreen = getCSS(16);
    const largeScreen = getCSS(12);

    const [css, setCSS] = useState<CSSProperties>(largeScreen);

    useEffect(() => {
        if (matchesLarge) {
            setCSS(largeScreen);
        } else if (matchesMedium) {
            setCSS(mediumScreen);
        } else {
            setCSS(smallScreen);
        }
    }, [matchesMedium, matchesLarge]);

    return (
        <button className={style.square} onClick={props.onClick} style={css}>
            {props.value}
        </button>
    );
}
