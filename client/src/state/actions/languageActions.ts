import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { LanguageState } from "../reducers/languageReducer";

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

export type LanguageAction = {
    type: "SET_LANGUAGE";
    payload: string;
};
/**
 * Set the language of the app
 * @param language    The language code (i.e. "de", "en")
 */
const setLanguage = (language: string): LanguageAction => ({ type: "SET_LANGUAGE", payload: language });

export const useLanguage = (): [string, (content: string) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, LanguageState["language"]>((state) => state.language.language);

    const set = (content: string): void => {
        dispatch(setLanguage(content));
    };
    return [get, set];
};
