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

import { DisplayStateAction } from "../actions/displayStateActions";
export interface DisplayState {
    pollState: boolean;
    evalState: boolean;
    leaderboardUpdate: boolean;
}

const initialState: DisplayState = {
    pollState: false,
    evalState: false,
    leaderboardUpdate: false,
};

export const displayStateReducer = (state: DisplayState = initialState, action: DisplayStateAction): DisplayState => {
    switch (action.type) {
        case "SET_EVAL":
            return { ...state, evalState: action.payload };
        case "SET_POLL":
            return { ...state, pollState: action.payload };
        case "UPDATE_LEADERBOARD":
            return { ...state, leaderboardUpdate: action.payload };
        default:
            return state;
    }
};
