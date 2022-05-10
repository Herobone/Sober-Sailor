/*****************************
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
import { Scoreboard } from "sobersailor-common/lib/models/GameScoreboard";
import { ScoreboardAction } from "../actions/scoreboardAction";

export interface ScoreboardState {
    scoreboard: Scoreboard;
}

const initialState: ScoreboardState = {
    scoreboard: Scoreboard.init(),
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export const scoreboardReducer = (state: ScoreboardState = initialState, action: ScoreboardAction): ScoreboardState => {
    switch (action.type) {
        case "SET_SCOREBOARD":
            return { ...state, scoreboard: action.payload };
        default:
            return state;
    }
};
