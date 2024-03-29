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
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";

export const useLeaderboardStyles = makeStyles((theme: Theme) => ({
    leaderboardPlace: {
        color: "red",
        backgroundColor: "blue",
        padding: theme.spacing(1),
    },
    sideHeading: {
        textAlign: "center",
        margin: theme.spacing(0.3),
        fontSize: 20,
    },
    sideArea: {
        width: "100%",
        padding: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
    },
}));
