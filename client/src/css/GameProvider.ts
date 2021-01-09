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
import { createStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const GameProviderStyle = (theme: Theme) =>
    createStyles({
        nameInput: {
            width: "40%",
            margin: theme.spacing(2),
        },
        leaveGameFab: {
            position: "absolute",
            bottom: theme.spacing(4),
            left: theme.spacing(2),
        },

        [theme.breakpoints.down("sm")]: {
            nameInput: {
                width: "90%",
            },
        },
    });
