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

import React, { forwardRef, ReactElement, useImperativeHandle } from "react";
import { FormattedMessage } from "react-intl";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { GameManager } from "../../helper/gameManager";
import { playerConverter } from "../../helper/models/Player";
import { useLeaderboardStyles } from "../../css/LeaderboardStyle";

type leaderboard = Map<string, number>;
type LeaderboardHandles = {
    updateLeaderboard: () => void;
};

export const Leaderboard = forwardRef<LeaderboardHandles>(
    (props, ref): JSX.Element => {
        const [leaderboard, setLeaderboard] = React.useState<leaderboard>(new Map<string, number>());

        const classes = useLeaderboardStyles();

        const updateLB = (): void => {
            const lead = GameManager.getGame()
                .collection("players")
                .withConverter(playerConverter)
                .orderBy("sips", "desc");
            const lb = new Map<string, number>();
            lead.get()
                .then((query) => {
                    query.forEach((doc) => {
                        const data = doc.data();
                        if (data) {
                            lb.set(data.nickname, data.sips);
                        }
                    });
                    setLeaderboard(lb);
                    return Promise.resolve();
                })
                .catch(console.error);
        };

        useImperativeHandle(ref, () => ({
            updateLeaderboard: updateLB,
        }));

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
                    <FormattedMessage id="elements.leaderboard" />
                </h1>
                <Table className="leaderboard">
                    <TableHead>
                        <TableRow>
                            <TableCell className="leaderboard-header-rank">
                                <FormattedMessage id="elements.general.rank" />
                            </TableCell>
                            <TableCell className="leaderboard-header-nickname">
                                <FormattedMessage id="general.nickname" />
                            </TableCell>
                            <TableCell className="leaderboard-header-score">
                                <FormattedMessage id="general.sips" />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{prepareLeaderboard()}</TableBody>
                </Table>
            </TableContainer>
        );
    },
);
