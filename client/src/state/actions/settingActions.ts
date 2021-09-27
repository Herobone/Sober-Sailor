import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { SettingState } from "../reducers/settingReducer";
import { AvailableThemes } from "../../style/Theme";

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

export type SettingAction = {
    type: "SET_LANGUAGE" | "SET_THEME";
    payload: string;
};

export type BooleanAction = {
    type: "SET_COOKIES_OPEN";
    payload: boolean;
};

const setTheme = (theme: string): SettingAction => ({ type: "SET_THEME", payload: theme });

export const useThemeSetting = (): [AvailableThemes, (content: AvailableThemes) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, SettingState["theme"]>((state) => state.settings.theme);

    const set = (content: AvailableThemes): void => {
        dispatch(setTheme(content));
    };
    return [get, set];
};

const setCookiesOpen = (open: boolean): BooleanAction => ({ type: "SET_COOKIES_OPEN", payload: open });

export const useCookiesOpen = (): [boolean, (content: boolean) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, SettingState["cookiesOpen"]>((state) => state.settings.cookiesOpen);

    const set = (content: boolean): void => {
        dispatch(setCookiesOpen(content));
    };
    return [get, set];
};

/**
 * Set the language of the app
 * @param language    The language code (i.e. "de", "en")
 */
const setLanguage = (language: string): SettingAction => ({ type: "SET_LANGUAGE", payload: language });

export const useLanguage = (): [string, (content: string) => void] => {
    const dispatch = useDispatch();
    const get = useSelector<RootState, SettingState["language"]>((state) => state.settings.language);

    const set = (content: string): void => {
        dispatch(setLanguage(content));
    };
    return [get, set];
};
