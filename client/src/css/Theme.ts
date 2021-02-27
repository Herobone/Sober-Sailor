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
            default: "#7cdbd5",
        },
        primary: {
            main: "#f53240",
        },
        secondary: {
            main: "#fabd03",
            contrastText: "#02c8a7",
        },
    },
    typography: {
        fontFamily: ["Ubuntu"].join(","),
    },
});

export const DarkTheme = createMuiTheme({
    palette: {
        background: {
            default: "#414141",
        },
        primary: {
            main: "#FF6A5C",
        },
        secondary: {
            main: "#056571",
            contrastText: "#ccdfcb",
        },
    },
    typography: {
        fontFamily: ["Ubuntu"].join(","),
    },
});

export const CalmTheme = createMuiTheme({
    palette: {
        background: {
            default: "#99ced4",
        },
        primary: {
            main: "#ee8687",
        },
        secondary: {
            main: "#4abdac",
            contrastText: "#6e7376",
        },
    },
    typography: {
        fontFamily: ["Ubuntu"].join(","),
    },
});

export const responsiveTheme = responsiveFontSizes(CalmTheme);
