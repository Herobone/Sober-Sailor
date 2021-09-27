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

import { MultiAnswer } from "sobersailor-common/lib/models/Task";
import {
    AnswerAction,
    CombinedTaskAction,
    NumberAction,
    StringAction,
    UncertainNumberAction,
} from "../actions/taskActions";

export interface TaskState {
    task: string | undefined;
    taskID: number | undefined;
    type: string | undefined;
    target: string | undefined;
    penalty: number;
    answers: MultiAnswer[] | undefined;
}

const initialState: TaskState = {
    task: undefined,
    taskID: undefined,
    type: undefined,
    target: undefined,
    penalty: 0,
    answers: undefined,
};

export const taskReducer = (
    state: TaskState = initialState,
    action: StringAction | NumberAction | AnswerAction | UncertainNumberAction | CombinedTaskAction,
): TaskState => {
    switch (action.type) {
        case "SET_TASK":
            return { ...state, task: action.payload };
        case "SET_TARGET":
            return { ...state, target: action.payload };
        case "SET_TYPE":
            return { ...state, type: action.payload };
        case "SET_PENALTY":
            return { ...state, penalty: action.payload };
        case "SET_ANSWERS":
            return { ...state, answers: action.payload };
        case "SET_TASK_ID":
            return { ...state, taskID: action.payload };
        case "SET_TASK_COMBINED":
            return { ...state, ...action.payload };
        default:
            return state;
    }
};
