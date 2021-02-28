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
import { combineReducers, createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import { taskReducer, TaskState } from "./reducers/taskReducer";
import { DisplayState, displayStateReducer } from "./reducers/displayStateReducer";
import { resultReducer, ResultState } from "./reducers/resultReducer";
import { gameReducer, GameState } from "./reducers/gameReducer";

export interface RootState {
    task: TaskState;
    displayState: DisplayState;
    result: ResultState;
    game: GameState;
}

export const store = createStore(
    combineReducers<RootState>({
        task: taskReducer,
        displayState: displayStateReducer,
        result: resultReducer,
        game: gameReducer,
    }),
    process.env.NODE_ENV !== "production" ? devToolsEnhancer({ trace: true, traceLimit: 25 }) : undefined,
);
