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
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";

export const StandardTheme = createMuiTheme({
    palette: {
        background: {
            default: "#8a989f",
        },
        primary: {
            main: "#48cae4",
            light: "#90e0ef",
            dark: "#00b4d8",
            contrastText: "#4242FF",
        },
        secondary: {
            main: "#ffaa00",
            light: "#ffff00",
            dark: "#ff8000",
        },
    },
});
export const responsiveTheme = responsiveFontSizes(StandardTheme);
