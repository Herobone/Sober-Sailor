import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { DisplayState } from "../reducers/displayStateReducer";

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

export type DisplayStateAction = { type: "SET_POLL" | "SET_EVAL"; payload: boolean };

/**
 * Set the Poll state (Whether a poll is currently running)
 * @param state    The state of the poll
 */
export const setPollState = (state: boolean): DisplayStateAction => ({ type: "SET_POLL", payload: state });

/**
 * Set the evaluation state
 *
 * If true the data will be evaluated and the results will be shown
 * @param state     The state of evaluation
 */
export const setEvalState = (state: boolean): DisplayStateAction => ({ type: "SET_EVAL", payload: state });

export const useEvalState = (): [boolean, (content: boolean) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, DisplayState["evalState"]>((state) => state.displayState.evalState);

    const set = (content: boolean): void => {
        dispatch(setEvalState(content));
    };
    return [get, set];
};

export const usePollState = (): [boolean, (content: boolean) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, DisplayState["pollState"]>((state) => state.displayState.pollState);

    const set = (content: boolean): void => {
        dispatch(setPollState(content));
    };
    return [get, set];
};
