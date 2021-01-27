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
export const DefaultStyle = (theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(2),
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
        },
        settingsButton: {
            position: "absolute",
            bottom: theme.spacing(4),
            right: theme.spacing(2),
            '&:hover': {},
        },
        infoButton: {
            position: "absolute",
            bottom: theme.spacing(4+8),
            right: theme.spacing(2),
        },
        creditsButton: {
            position: "absolute",
            bottom: theme.spacing(4+2*8),
            right: theme.spacing(2),
        },
        settingsModal: {
            width: "60%",
            margin: "5% auto 15% auto", // 5% from the top, 15% from the bottom and centered
        },
        [theme.breakpoints.down("sm")]: {
            settingsModal: {
                width: "90%",
            },
        },
        margin: {
            margin: theme.spacing(1),
        },
        margin4: {
            margin: theme.spacing(4),
        },
        gameSelectButton: {
            width: "100%",
            // fontWeight: "bold",
            fontSize: 30,
            padding: theme.spacing(1),
            marginTop: theme.spacing(2),
            border: "4px solid",
            borderRadius: 100,
            minWidth: 200,
            minHeight: 50,
            '&:hover': {
                border: "4px solid"
            },
            
        },
        gameSelectIcon: {
            fontSize: 70,
            padding: 10
        },

        startPage: {
            padding: theme.spacing(2),
            maxWidth: 500,
            textAlign: "center",
        },
        h1: {
            fontSize: 70,
        },



        mainGrid: {
            flexGrow: 1,
            width: "100%"
        },

        mainHeadingName: {
            position: "relative",
            fontSize: 30,
            textAlign: "left"
        },

        sideArea: {
            width: "100%",
            padding: theme.spacing(0.5),
            marginBottom: theme.spacing(0.5)
        },
        sideHeading:  {
            textAlign: "center",
            margin: theme.spacing(0.3),
            fontSize: 20,
        },
        hostButton: {
            marginBottom: theme.spacing(0.6),
            width: "100%",
            textAlign: "center"
        },

        mainArea: {
            textAlign: "left",
        },

        progressBar: {
            width: "100%",
        },

    });
