/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020-2022.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

import React, { ReactElement, useEffect } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { GameManager } from "../../helper/gameManager";
import { useLeaderboardStyles } from "../../style/LeaderboardStyle";
import { useScoreboard } from "../../state/actions/scoreboardAction";
import { TranslatedMessage } from "../../translations/TranslatedMessage";

type leaderboard = Map<string, number>;

export const Leaderboard = (): JSX.Element => {
    const [leaderboard, setLeaderboard] = React.useState<leaderboard>(new Map<string, number>());
    const [scoreboard] = useScoreboard();

    const classes = useLeaderboardStyles();

    const updateLB = (): void => {
        const lb = new Map<string, number>();

        const plt = GameManager.getPlayerLookupTable();
        if (!plt) {
            return;
        }

        scoreboard.board.forEach((value, key) => {
            const nickname = plt.playerUidMap.get(key) || "Error Name";
            lb.set(nickname, value);
        });

        setLeaderboard(lb);
    };

    useEffect(() => {
        updateLB();
    }, [scoreboard]);

    const prepareLeaderboard = (): ReactElement[] => {
        const values: ReactElement[] = [];
        let counter = 1;
        leaderboard.forEach((value: number, key: string) => {
            values.push(
                <TableRow key={`leaderboard${counter}`}>
                    <TableCell align="center">{counter}</TableCell>
                    <TableCell className="leaderboard-nickname">{key}</TableCell>
                    <TableCell align="center" className="leaderboard-score">
                        {value}
                    </TableCell>
                </TableRow>,
            );
            counter++;
        });

        return values;
    };

    return (
        <TableContainer className={classes.sideArea} component={Paper}>
            <h1 className={classes.sideHeading}>
                <TranslatedMessage id="elements.leaderboard" />
            </h1>
            <Table className="leaderboard">
                <TableHead>
                    <TableRow>
                        <TableCell className="leaderboard-header-rank" align="center">
                            <TranslatedMessage id="elements.general.rank" />
                        </TableCell>
                        <TableCell className="leaderboard-header-nickname">
                            <TranslatedMessage id="general.nickname" />
                        </TableCell>
                        <TableCell className="leaderboard-header-score" align="center">
                            <TranslatedMessage id="general.sips" />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{prepareLeaderboard()}</TableBody>
            </Table>
        </TableContainer>
    );
};
