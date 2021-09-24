import { useDispatch, useSelector } from "react-redux";
import { MultiAnswer } from "sobersailor-common/lib/models/Task";
import { RootState } from "../store";
import { TaskState } from "../reducers/taskReducer";

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

export type StringAction = {
    type: "SET_TASK" | "SET_TYPE" | "SET_TARGET";
    payload: string | undefined;
};

/**
 * Set the current task
 * @param task  The task to set
 */
export const setTask = (task: string | undefined): StringAction => ({ type: "SET_TASK", payload: task });

/**
 * Set the current Tasks type
 * @param type  The tasks type
 */
export const setType = (type: string | undefined): StringAction => ({ type: "SET_TYPE", payload: type });

/**
 * Set the current Tasks target
 * @param target    The tasks target
 */
export const setTarget = (target: string | undefined): StringAction => ({ type: "SET_TARGET", payload: target });

/**
 * Set the current Tasks penalty
 * @param penalty    The tasks penalty
 */
export const setPenalty = (penalty: number): NumberAction => ({ type: "SET_PENALTY", payload: penalty });

/**
 * Set the current task id
 * @param id  The task id to set
 */
export const setTaskID = (id: number | undefined): UncertainNumberAction => ({ type: "SET_TASK_ID", payload: id });

export type NumberAction = {
    type: "SET_PENALTY";
    payload: number;
};

export type UncertainNumberAction = {
    type: "SET_TASK_ID";
    payload: number | undefined;
};

/**
 * Set the current Tasks answers
 * @param answers    The tasks answers
 */
export const setAnswers = (answers: MultiAnswer[] | undefined): AnswerAction => ({
    type: "SET_ANSWERS",
    payload: answers,
});

export type AnswerAction = {
    type: "SET_ANSWERS";
    payload: MultiAnswer[] | undefined;
};

export const useTaskType = (): [string | undefined, (content: string | undefined) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["type"]>((state) => state.task.type);

    const set = (content: string | undefined): void => {
        dispatch(setType(content));
    };
    return [get, set];
};

export const useTask = (): [string | undefined, (content: string | undefined) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["task"]>((state) => state.task.task);

    const set = (content: string | undefined): void => {
        dispatch(setTask(content));
    };
    return [get, set];
};

export const useTarget = (): [string | undefined, (content: string | undefined) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["target"]>((state) => state.task.target);

    const set = (content: string | undefined): void => {
        dispatch(setTarget(content));
    };
    return [get, set];
};

export const usePenalty = (): [number, (content: number) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["penalty"]>((state) => state.task.penalty);

    const set = (content: number): void => {
        dispatch(setPenalty(content));
    };
    return [get, set];
};

export const useTaskID = (): [number | undefined, (content: number | undefined) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["taskID"]>((state) => state.task.taskID);

    const set = (content: number | undefined): void => {
        dispatch(setTaskID(content));
    };
    return [get, set];
};

export const useAnswers = (): [MultiAnswer[] | undefined, (content: MultiAnswer[] | undefined) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["answers"]>((state) => state.task.answers);

    const set = (content: MultiAnswer[] | undefined): void => {
        dispatch(setAnswers(content));
    };
    return [get, set];
};
