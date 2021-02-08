/** ***************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2021.
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
import { createStyles, makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useGameProviderStlye = makeStyles((theme: Theme) =>
    createStyles({
        nameInput: {
            position: "relative",
            width: "40%",
            margin: theme.spacing(2),
        },
        leaveGameFab: {
            position: "fixed",
            bottom: theme.spacing(4),
            left: theme.spacing(2),
        },
        createGameButton: {
            position: "relative",
            top: theme.spacing(3),
        },
        inputGameIDField: {
            position: "relative",
            top: theme.spacing(11.5),
            padding: theme.spacing(1),
        },
        inputGameIDButton: {
            position: "relative",
            top: theme.spacing(13),
        },
        inputNameButton: {
            position: "relative",
            top: theme.spacing(2),
        },

        [theme.breakpoints.down("sm")]: {
            nameInput: {
                width: "90%",
            },
        },
        centeraligned: {
            position: "relative",
            textAlign: "center",
        },
        h1: {
            fontSize: 70,
        },
        h1_long: {
            textAlign: "center",
            fontSize: 40,
            padding: theme.spacing(1),
        },
    }),
);
