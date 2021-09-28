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
import { Button, IconButton, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { ArrowForwardIos } from "@mui/icons-material";
import React from "react";
import { useGameProviderStyle } from "../../style/GameProvider";
import { GameManager } from "../../helper/gameManager";
import { Alerts } from "../../helper/AlertTypes";
import { TranslatedMessage } from "../../translations/TranslatedMessage";
import { useAlert } from "./AlertProvider";

export function GameCreator(): JSX.Element {
    const { createAlert } = useAlert();
    const classes = useGameProviderStyle();

    const createGame = (): void => {
        GameManager.createGame()
            .then((newGameID) => {
                window.location.pathname = `/play/${newGameID}`;
                return Promise.resolve();
            })
            .catch((error: string) => createAlert(Alerts.ERROR, error));
    };

    return (
        <>
            <h1 className={classes.h1}>
                <TranslatedMessage id="sobersailor.name" />
            </h1>
            <Button
                variant="contained"
                color="primary"
                className={classes.createGameButton}
                onClick={createGame}
                size="large"
            >
                <TranslatedMessage id="actions.game.create" />
            </Button>

            <div className={classes.centeraligned}>
                <TextField
                    label="GameID"
                    color="primary"
                    id="outlined-start-adornment"
                    className={classes.inputGameIDField}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{window.location.host}</InputAdornment>,
                    }}
                    variant="outlined"
                />
                <IconButton
                    color="primary"
                    className={classes.inputGameIDButton}
                    // goToGame needs to redirect to the game URL
                    aria-label="Go to your game!"
                    size="large"
                >
                    <ArrowForwardIos />
                </IconButton>
            </div>
        </>
    );
}
