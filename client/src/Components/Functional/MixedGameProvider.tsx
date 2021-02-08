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

import React, { PropsWithChildren, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { FormattedMessage } from "react-intl";
import { Fab, IconButton, TextField } from "@material-ui/core";
import { ArrowForwardIos, ExitToAppRounded } from "@material-ui/icons";
import { Alerts } from "../../helper/AlertTypes";
import { GameManager } from "../../helper/gameManager";
import { useAlert } from "./AlertProvider";
import { useGameProviderStlye } from "../../css/GameProvider";
import { GameCreator } from "./GameCreator";

interface Props {
    gameID?: string;
}

export function MixedGameProvider(props: PropsWithChildren<Props>): JSX.Element {
    const { createAlert } = useAlert();
    const [name, setName] = useState("");
    const [user, setUser] = useState<firebase.User>();

    // const { gameID } = props;
    const classes = useGameProviderStlye();

    if (props.gameID) {
        localStorage.setItem("gameID", props.gameID);
    } else {
        GameManager.removeLocalData();
    }

    useEffect((): void => {
        const { currentUser } = firebase.auth();
        if (!currentUser) {
            firebase
                .auth()
                .signInAnonymously()
                .catch((error) => {
                    createAlert(Alerts.ERROR, error.message);
                    console.error(error.message);
                });
        }
        firebase.auth().onAuthStateChanged((authStateUser) => {
            console.info("Auth change");
            setUser(authStateUser || undefined);
        });
    }, []);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    };

    const processName = (): void => {
        const { currentUser } = firebase.auth();

        if (!currentUser) {
            createAlert(Alerts.ERROR, <FormattedMessage id="general.shouldnothappen" />);
            return;
        }

        if (name.length < 2) {
            createAlert(Alerts.WARNING, <FormattedMessage id="account.actions.noname" />);
            return;
        }

        currentUser.updateProfile({ displayName: name }).catch(console.error);
    };

    const prepareRunningGame = (): JSX.Element => {
        return (
            <>
                {props.children}
                <Fab
                    variant="extended"
                    color="primary"
                    onClick={() => GameManager.leaveGame()}
                    className={classes.leaveGameFab}
                >
                    <ExitToAppRounded />
                    <FormattedMessage id="actions.leave" />
                </Fab>
            </>
        );
    };

    const prepareNameSetter = (): JSX.Element => {
        return (
            <>
                <h1 className={classes.h1_long}>
                    <FormattedMessage id="account.descriptors.finishsignup" />
                </h1>
                <br />
                <TextField
                    required
                    label="Name"
                    variant="outlined"
                    color="primary"
                    className={classes.nameInput}
                    onChange={onNameChange}
                    onKeyPress={(event) => {
                        if (event.key === "Enter" || event.key === "Accept") {
                            processName();
                        }
                    }}
                />
                <IconButton
                    color="primary"
                    className={classes.inputNameButton}
                    aria-label="Go to your game!"
                    onClick={processName}
                >
                    <ArrowForwardIos />
                </IconButton>
            </>
        );
    };

    const userReady: boolean = !!user && !!user.displayName && user.displayName.length >= 2;

    return (
        <div className={classes.centeraligned}>
            {userReady && !props.gameID && <GameCreator />}
            {userReady && prepareRunningGame()}
            {user && (!user.displayName || user.displayName.length <= 1) && prepareNameSetter()}
            {!user && <div>ERROR!</div>}
        </div>
    );
}
