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
import { BooleanAction, SettingAction } from "../actions/settingActions";
import { AvailableThemes } from "../../style/Theme";

export type Filler = "cats" | "dogs" | "memes";

export interface SettingState {
    language: string;
    theme: AvailableThemes;
    cookiesOpen: boolean;
    filler: Filler;
}

const initialState: SettingState = {
    language: "en",
    theme: "calm",
    cookiesOpen: false,
    filler: "cats",
};

export const settingReducer = (
    // eslint-disable-next-line @typescript-eslint/default-param-last
    state: SettingState = initialState,
    action: SettingAction | BooleanAction,
): SettingState => {
    switch (action.type) {
        case "SET_LANGUAGE":
            return { ...state, language: action.payload };
        case "SET_THEME":
            return { ...state, theme: action.payload as AvailableThemes };
        case "SET_COOKIES_OPEN":
            return { ...state, cookiesOpen: action.payload };
        case "SET_FILLER":
            return { ...state, filler: action.payload as Filler };
        default:
            return state;
    }
};
