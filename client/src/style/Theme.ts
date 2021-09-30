/*****************************
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
import { createTheme, responsiveFontSizes } from "@mui/material";

export type AvailableThemes = "light" | "calm" | "dark" | "highcontrast" | "hacker" | "minimalist";

declare module "@mui/material/styles" {
    interface TypographyVariants {
        poster: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        poster?: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        poster: true;
    }
}

export const StandardTheme = responsiveFontSizes(
    createTheme({
        palette: {
            mode: "light",
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
    }),
);

export const DarkTheme = responsiveFontSizes(
    createTheme({
        palette: {
            mode: "dark",
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
    }),
);

export const CalmTheme = responsiveFontSizes(
    // wer hat sich das ausgedacht???
    createTheme({
        palette: {
            mode: "light",
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
    }),
);

export const HighContrastTheme = responsiveFontSizes(
    createTheme({
        palette: {
            mode: "dark",
            background: {
                default: "#14213d",
            },
            primary: {
                main: "#fca311",
            },
            secondary: {
                main: "#e5e5e5",
                contrastText: "#ffffff",
            },
        },
        typography: {
            fontFamily: ["Ubuntu"].join(","),
        },
    }),
);

export const HackerTheme = responsiveFontSizes(
    //green on black
    createTheme({
        palette: {
            mode: "dark",
            background: {
                default: "#000000",
            },
            primary: {
                main: "#2bc016",
            },
            secondary: {
                main: "#2bc016",
                contrastText: "#2bc016",
            },
        },
        typography: {
            h1: {
                color: "#2bc016",
            },
            fontFamily: ["Ubuntu"].join(","),
        },
    }),
);

export const MinimalistTheme = responsiveFontSizes(
    // gray and white
    createTheme({
        palette: {
            mode: "light",
            background: {
                default: "#adb5bd",
            },
            primary: {
                main: "#495057",
            },
            secondary: {
                main: "#e9ecef",
                contrastText: "#343a40",
            },
        },
        typography: {
            fontFamily: ["Ubuntu"].join(","),
        },
    }),
);
