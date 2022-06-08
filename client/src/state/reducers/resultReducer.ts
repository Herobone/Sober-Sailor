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

import { Player } from "sobersailor-common/lib/models/Player";
import { EvaluationScoreboard } from "sobersailor-common/lib/models/EvaluationScoreboard";
import { EvaluationScoreboardAction, ResultAction } from "../actions/resultActions";

export interface ResultState {
    result: Player[] | null;
    evaluationScoreboard: EvaluationScoreboard;
}

const initialState: ResultState = {
    result: null,
    evaluationScoreboard: EvaluationScoreboard.init(),
};

export const resultReducer = (
    // eslint-disable-next-line @typescript-eslint/default-param-last
    state: ResultState = initialState,
    action: ResultAction | EvaluationScoreboardAction,
): ResultState => {
    switch (action.type) {
        case "SET_RESULT":
            return { ...state, result: action.payload };
        case "SET_EVALUATION_SCOREBOARD":
            return { ...state, evaluationScoreboard: action.payload };
        default:
            return state;
    }
};
