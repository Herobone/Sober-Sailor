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
