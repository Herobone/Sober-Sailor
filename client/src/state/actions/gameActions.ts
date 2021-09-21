import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { GameState } from "../reducers/gameReducer";

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

export type HostGameActions = {
    type: "SET_HOST";
    payload: boolean;
};

/**
 * Set the player to host
 * @param host  Is the player host or not?
 */
export const setHost = (host: boolean): HostGameActions => ({ type: "SET_HOST", payload: host });

export const useIsHost = (): [boolean, (content: boolean) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, GameState["host"]>((state) => state.game.host);

    const set = (content: boolean): void => {
        dispatch(setHost(content));
    };
    return [get, set];
};
