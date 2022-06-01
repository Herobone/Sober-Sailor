/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2022.
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

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { GameState } from "../reducers/gameReducer";

export type GameActions = {
    type: "SET_HOST" | "SET_ONLINE";
    payload: boolean;
};

export type GameArrayActions = {
    type: "SET_PLAYERS_ONLINE";
    payload: string[];
};

/**
 * Set the player to host
 * @param host  Is the player host or not?
 */
export const setHost = (host: boolean): GameActions => ({ type: "SET_HOST", payload: host });

export const useIsHost = (): [boolean, (content: boolean) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, GameState["host"]>((state) => state.game.host);

    const set = (content: boolean): void => {
        dispatch(setHost(content));
    };
    return [get, set];
};

/**
 * Set the players online state
 * @param online  Is the player online or not?
 */
export const setOnline = (online: boolean): GameActions => ({ type: "SET_ONLINE", payload: online });

export const useIsOnline = (): [boolean, (content: boolean) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, GameState["online"]>((state) => state.game.online);

    const set = (content: boolean): void => {
        dispatch(setOnline(content));
    };
    return [get, set];
};

/**
 * Set the array of players who are online
 * @param online  Array of player UIDs
 */
export const setPlayersOnline = (online: string[]): GameArrayActions => ({
    type: "SET_PLAYERS_ONLINE",
    payload: online,
});

export const usePlayersOnline = (): [string[], (content: string[]) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, GameState["playersOnline"]>((state) => state.game.playersOnline);

    const set = (content: string[]): void => {
        dispatch(setPlayersOnline(content));
    };
    return [get, set];
};
