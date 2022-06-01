/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2021-2022.
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

import { GameActions, GameArrayActions } from "../actions/gameActions";

export interface GameState {
    host: boolean;
    online: boolean;
    playersOnline: string[];
}

const initialState: GameState = {
    host: false,
    online: false,
    playersOnline: [],
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export const gameReducer = (state: GameState = initialState, action: GameActions | GameArrayActions): GameState => {
    switch (action.type) {
        case "SET_HOST":
            return { ...state, host: action.payload };
        case "SET_ONLINE":
            return { ...state, online: action.payload };
        case "SET_PLAYERS_ONLINE":
            return { ...state, playersOnline: action.payload };
        default:
            return state;
    }
};
