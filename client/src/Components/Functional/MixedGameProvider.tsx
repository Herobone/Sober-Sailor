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
import { FormattedMessage } from "react-intl";
import { CircularProgress, Fab, IconButton, TextField } from "@mui/material";
import { ArrowForwardIos, ExitToAppRounded } from "@mui/icons-material";
import Cookies from "universal-cookie";
import { getAuth, signInAnonymously, onAuthStateChanged, User, updateProfile } from "firebase/auth";
import { Alerts } from "../../helper/AlertTypes";
import { GameManager } from "../../helper/gameManager";
import { useGameProviderStlye } from "../../style/GameProvider";
import { firebaseApp } from "../../helper/config";
import { useAlert } from "./AlertProvider";
import { GameCreator } from "./GameCreator";

interface Props {
    gameID?: string;
}

export function MixedGameProvider(props: PropsWithChildren<Props>): JSX.Element {
    const { createAlert } = useAlert();
    const [name, setName] = useState("");
    const [user, setUser] = useState<User>();

    const auth = getAuth(firebaseApp);

    const [userReady, setUserReady] = useState(false);

    // const { gameID } = props;
    const classes = useGameProviderStlye();

    if (props.gameID) {
        localStorage.setItem("gameID", props.gameID);
    } else {
        GameManager.removeLocalData();
    }

    const updateReadyState = (): void => {
        setUserReady(!!user && !!user.displayName && user.displayName.length >= 2);
    };

    useEffect((): void => {
        updateReadyState();
    }, [user]);

    useEffect((): void => {
        const { currentUser } = auth;
        const cookies = new Cookies();
        const globalAccount: boolean = cookies.get("globalAccount");
        if (!currentUser && !globalAccount) {
            signInAnonymously(auth).catch((error) => {
                createAlert(Alerts.ERROR, error.message);
                console.error(error.message);
            });
        }
        onAuthStateChanged(auth, (authStateUser) => {
            console.info("Auth change");
            setUser(authStateUser || undefined);
            updateReadyState();
        });
    }, []);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    };

    const processName = (): void => {
        const { currentUser } = auth;

        if (!currentUser) {
            createAlert(Alerts.ERROR, <FormattedMessage id="general.shouldnothappen" />);
            return;
        }

        if (name.length < 2) {
            createAlert(Alerts.WARNING, <FormattedMessage id="account.actions.noname" />);
            return;
        }

        updateProfile(currentUser, { displayName: name })
            .then(() => {
                createAlert(Alerts.SUCCESS, "Name set");
                setUser(currentUser);
                updateReadyState();
                return Promise.resolve();
            })
            .catch(console.error);
    };

    const prepareRunningGame = (): JSX.Element => (
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

    const prepareNameSetter = (): JSX.Element => (
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
                size="large"
            >
                <ArrowForwardIos />
            </IconButton>
        </>
    );

    if (user && !userReady) {
        return prepareNameSetter();
    }

    if (userReady && !props.gameID) {
        return <GameCreator />;
    }

    if (userReady) {
        return prepareRunningGame();
    }

    return (
        <>
            <CircularProgress />
        </>
    );
}
