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

import { TableRow, TableCell, TableContainer, TableHead, TableBody, Table, Paper } from "@material-ui/core";
import React, { ReactElement } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { Player } from "@herobone/sobersailor-common/lib/models/Player";
import { useDefaultStyles } from "../../css/Style";
import { ResultState } from "../../state/reducers/resultReducer";
import { RootState } from "../../state/store";

export function ResultPage(): JSX.Element {
    const classes = useDefaultStyles();

    const result = useSelector<RootState, ResultState["result"]>((state) => state.result.result);

    const prepareResults = (): ReactElement[] => {
        console.log("Results:", result);
        const values: ReactElement[] = [];
        let counter = 1;
        if (result !== null) {
            result.forEach((entry: Player) => {
                values.push(
                    <TableRow key={`rank${counter}`}>
                        <TableCell align="center" className="result-rank">
                            {counter}
                        </TableCell>
                        <TableCell className="result-nickname">{entry.nickname}</TableCell>
                        <TableCell className="result-their-answer">{entry.answer}</TableCell>
                        <TableCell align="center" className="result-sips">
                            {entry.sips}
                        </TableCell>
                    </TableRow>,
                );
                counter++;
            });
        }

        return values;
    };

    if (!result || result.length <= 0) {
        return <></>;
    }

    return (
        <div className={classes.resultTable}>
            <TableContainer component={Paper} elevation={5}>
                <h2 className={classes.sideHeading}>
                    <FormattedMessage id="elements.results" />
                </h2>
                <Table className="result-table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className="result-header-rank">
                                <FormattedMessage id="elements.general.rank" />
                            </TableCell>
                            <TableCell className="result-header-nickname">
                                <FormattedMessage id="general.nickname" />
                            </TableCell>
                            <TableCell className="result-header-their-answer">
                                <FormattedMessage id="general.answer" />
                            </TableCell>
                            <TableCell align="center" className="result-header-sips">
                                <FormattedMessage id="general.sips" />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{prepareResults()}</TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
