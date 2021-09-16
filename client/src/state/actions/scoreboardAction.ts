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
import { Scoreboard } from "@herobone/sobersailor-common/lib/models/GameScoreboard";
import { useDispatch, useSelector } from "react-redux";
import { ScoreboardState } from "../reducers/scoreboardReducer";
import { RootState } from "../store";

export type ScoreboardAction = {
    type: "SET_SCOREBOARD";
    payload: Scoreboard;
};

export const setScoreboard = (board: Scoreboard): ScoreboardAction => ({ type: "SET_SCOREBOARD", payload: board });

export const useScoreboard = (): [Scoreboard, (content: Scoreboard) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, ScoreboardState["scoreboard"]>((state) => state.scoreboard.scoreboard);

    const set = (content: Scoreboard): void => {
        dispatch(setScoreboard(content));
    };

    return [get, set];
};
