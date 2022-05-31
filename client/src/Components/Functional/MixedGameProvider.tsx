/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020-2022.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

import React, { PropsWithChildren, useEffect, useState } from "react";
import { Fab, IconButton, TextField, Typography } from "@mui/material";
import { ArrowForwardIos, ExitToAppRounded } from "@mui/icons-material";
import Cookies from "universal-cookie";
import { getAuth, signInAnonymously, onAuthStateChanged, User, updateProfile } from "firebase/auth";
import { Outlet, useParams } from "react-router";
import { getDatabase, onDisconnect, ref, serverTimestamp, set as setDB } from "firebase/database";
import { Alerts } from "../../helper/AlertTypes";
import { GameManager } from "../../helper/gameManager";
import { useGameProviderStyle } from "../../style/GameProvider";
import { firebaseApp } from "../../helper/config";
import { TranslatedMessage } from "../../translations/TranslatedMessage";
import { VisibilityContainer } from "../Visuals/VisibilityContainer";
import { LoadingIcon } from "../Visuals/LoadingIcon";
import { useIsOnline } from "../../state/actions/gameActions";
import { useAlert } from "./AlertProvider";
import { GameCreator } from "./GameCreator";

export function MixedGameProvider(props: PropsWithChildren<unknown>): JSX.Element {
    const { createAlert } = useAlert();
    const { gameID } = useParams<{
        gameID?: string;
    }>();
    const [name, setName] = useState("");
    const [user, setUser] = useState<User>();

    const auth = getAuth(firebaseApp);

    const [userReady, setUserReady] = useState(false);

    const classes = useGameProviderStyle();

    if (gameID) {
        localStorage.setItem("gameID", gameID);
    } else {
        GameManager.removeLocalData();
    }

    const updateReadyState = (): void => {
        setUserReady(!!user && !!user.displayName && user.displayName.length >= 2);
    };

    useEffect((): void => {
        updateReadyState();
    }, [user]);

    const db = getDatabase();

    const [online] = useIsOnline();

    const setOnlineStateDB = (): void => {
        if (!user || !gameID || !online) {
            return;
        }
        const onlineState = ref(db, `${gameID}/users/${user.uid}/onlineState`);

        // stores the timestamp of my last disconnect (the last time I was seen online)
        const lastOnlineRef = ref(db, `${gameID}/users/${user.uid}/lastOnline`);

        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        setDB(onlineState, true).catch((error) => createAlert(Alerts.ERROR, error));

        // When I disconnect, set online state to false
        onDisconnect(onlineState)
            .set(false)
            .catch((error) => createAlert(Alerts.ERROR, error));

        // When I disconnect, update the last time I was seen online
        onDisconnect(lastOnlineRef)
            .set(serverTimestamp())
            .catch((error) => createAlert(Alerts.ERROR, error));
    };

    useEffect(setOnlineStateDB, [online]);

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
            setOnlineStateDB();
        });
    }, []);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    };

    const processName = (): void => {
        const { currentUser } = auth;

        if (!currentUser) {
            createAlert(Alerts.ERROR, <TranslatedMessage id="general.shouldnothappen" />);
            return;
        }

        if (name.length < 2) {
            createAlert(Alerts.WARNING, <TranslatedMessage id="account.actions.noname" />);
            return;
        }

        updateProfile(currentUser, { displayName: name })
            .then(() => {
                createAlert(Alerts.SUCCESS, "Name set");
                setUser(currentUser);
                updateReadyState();
                return;
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
                <TranslatedMessage id="actions.leave" />
            </Fab>
            <Outlet />
        </>
    );

    const prepareNameSetter = (): JSX.Element => (
        <VisibilityContainer>
            <Typography variant="h2" className={classes.h1_long}>
                <TranslatedMessage id="account.descriptors.finishsignup" />
            </Typography>
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
        </VisibilityContainer>
    );

    if (user && !userReady) {
        return prepareNameSetter();
    }

    if (userReady && !gameID) {
        return <GameCreator />;
    }

    if (userReady) {
        return prepareRunningGame();
    }

    return <LoadingIcon />;
}
