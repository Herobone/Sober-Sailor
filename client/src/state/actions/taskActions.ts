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
type StringActionType = string | undefined;
type UncertainNumberType = number | undefined;
type AnswerActionType = MultiAnswer[] | undefined;

export type StringAction = {
    type: "SET_TASK" | "SET_TYPE" | "SET_TARGET";
    payload: StringActionType;
};

type CombinedPayload = {
    type: StringActionType;
    penalty: number;
    taskID: UncertainNumberType;
    target: StringActionType;
};

export type CombinedTaskAction = {
    type: "SET_TASK_COMBINED";
    payload: CombinedPayload;
};

export type AnswerAction = {
    type: "SET_ANSWERS";
    payload: AnswerActionType;
};

export type NumberAction = {
    type: "SET_PENALTY";
    payload: number;
};

export type UncertainNumberAction = {
    type: "SET_TASK_ID";
    payload: UncertainNumberType;
};

type setAllFunction = (
    type: StringActionType,
    penalty: number,
    taskID?: UncertainNumberType,
    target?: StringActionType,
) => void;

/**
 * Set the current task
 * @param task  The task to set
 */
const setTask = (task: StringActionType): StringAction => ({ type: "SET_TASK", payload: task });

/**
 * Set the current Tasks type
 * @param type  The tasks type
 */
const setType = (type: StringActionType): StringAction => ({ type: "SET_TYPE", payload: type });

/**
 * Set the current Tasks target
 * @param target    The tasks target
 */
const setTarget = (target: StringActionType): StringAction => ({ type: "SET_TARGET", payload: target });

/**
 * Set the current Tasks penalty
 * @param penalty    The tasks penalty
 */
const setPenalty = (penalty: number): NumberAction => ({ type: "SET_PENALTY", payload: penalty });

/**
 * Set the current task id
 * @param id  The task id to set
 */
const setTaskID = (id: UncertainNumberType): UncertainNumberAction => ({ type: "SET_TASK_ID", payload: id });

const setCombined = (
    type: StringActionType,
    penalty: number,
    taskID?: UncertainNumberType,
    target?: StringActionType,
): CombinedTaskAction => ({
    type: "SET_TASK_COMBINED",
    payload: {
        taskID,
        type,
        target,
        penalty,
    },
});

/**
 * Set the current Tasks answers
 * @param answers    The tasks answers
 */
export const setAnswers = (answers: AnswerActionType): AnswerAction => ({
    type: "SET_ANSWERS",
    payload: answers,
});

export const useTaskType = (): [StringActionType, (content: StringActionType) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["type"]>((state) => state.task.type);

    const set = (content: string | undefined): void => {
        dispatch(setType(content));
    };
    return [get, set];
};

export const useTask = (): [StringActionType, (content: StringActionType) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["task"]>((state) => state.task.task);

    const set = (content: StringActionType): void => {
        dispatch(setTask(content));
    };
    return [get, set];
};

export const useTarget = (): [StringActionType, (content: StringActionType) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["target"]>((state) => state.task.target);

    const set = (content: StringActionType): void => {
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

export const useTaskID = (): [UncertainNumberType, (content: UncertainNumberType) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["taskID"]>((state) => state.task.taskID);

    const set = (content: UncertainNumberType): void => {
        dispatch(setTaskID(content));
    };
    return [get, set];
};

export const useAnswers = (): [AnswerActionType, (content: AnswerActionType) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, TaskState["answers"]>((state) => state.task.answers);

    const set = (content: AnswerActionType): void => {
        dispatch(setAnswers(content));
    };
    return [get, set];
};

export const useAll = (): setAllFunction => {
    const dispatch = useDispatch();
    return function (type: StringActionType, penalty: number, taskID: UncertainNumberType, target: StringActionType) {
        dispatch(setCombined(type, penalty, taskID, target));
    };
};
