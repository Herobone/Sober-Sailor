import { Button, IconButton, TextField } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import InputAdornment from "@material-ui/core/InputAdornment";
import { ArrowForwardIos } from "@material-ui/icons";
import React from "react";
import { useGameProviderStlye } from "../../css/GameProvider";
import { useAlert } from "./AlertProvider";
import { Alerts } from "../../helper/AlertTypes";
import { GameManager } from "../../helper/gameManager";

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

interface Props {}

export function GameCreator(props: Props): JSX.Element {
    const { createAlert } = useAlert();
    const classes = useGameProviderStlye();

    const createGame = (): void => {
        GameManager.createGame()
            .then((newGameID) => {
                window.location.pathname = `/play/${newGameID}`;
                return Promise.resolve();
            })
            .catch(console.error);
    };

    return (
        <>
            <h1 className={classes.h1}>
                <FormattedMessage id="sobersailor.name" />
            </h1>
            <Button
                variant="contained"
                color="secondary"
                className={classes.createGameButton}
                onClick={createGame}
                size="large"
            >
                <FormattedMessage id="actions.game.create" />
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
                    aria-label="Go to your game!"
                    // goToGame needs to redirect to the game URL
                >
                    <ArrowForwardIos />
                </IconButton>
            </div>
        </>
    );
}
