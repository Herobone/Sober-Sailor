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
import { combineReducers, createStore } from "redux";
import { devToolsEnhancer } from "redux-devtools-extension";
import { taskReducer, TaskState } from "./reducers/taskReducer";
import { DisplayState, displayStateReducer } from "./reducers/displayStateReducer";
import { resultReducer, ResultState } from "./reducers/resultReducer";
import { gameReducer, GameState } from "./reducers/gameReducer";
import { settingReducer, SettingState } from "./reducers/settingReducer";
import { scoreboardReducer, ScoreboardState } from "./reducers/scoreboardReducer";

export interface RootState {
    task: TaskState;
    displayState: DisplayState;
    result: ResultState;
    game: GameState;
    settings: SettingState;
    scoreboard: ScoreboardState;
}

export const store = createStore(
    combineReducers<RootState>({
        task: taskReducer,
        displayState: displayStateReducer,
        result: resultReducer,
        game: gameReducer,
        settings: settingReducer,
        scoreboard: scoreboardReducer,
    }),
    devToolsEnhancer({ trace: true, traceLimit: 25 }),
);
