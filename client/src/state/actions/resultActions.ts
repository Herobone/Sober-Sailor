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

import { useDispatch, useSelector } from "react-redux";
import { Player } from "../../helper/models/Player";
import { RootState } from "../store";
import { ResultState } from "../reducers/resultReducer";

export type ResultAction = {
    type: "SET_RESULT";
    payload: Player[] | null;
};
/**
 * Set the results
 *
 * Null if none loaded
 * @param result    The results or null
 */
export const setResult = (result: Player[] | null): ResultAction => ({ type: "SET_RESULT", payload: result });

export const useResult = (): [Player[] | null, (content: Player[] | null) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, ResultState["result"]>((state) => state.result.result);

    const set = (content: Player[] | null): void => {
        dispatch(setResult(content));
    };
    return [get, set];
};
