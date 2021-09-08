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

import firebase from "firebase/compat/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseApp } from "./config";

export interface EvaluateGame {
    gameID: string;
}

export class Serverless {
    public static KICK_PLAYER = "kickPlayer";

    public static SINGLE_TARGET = "singleTarget";

    public static CLOSE_GAME = "closeGame";

    public static EVALUATE_GAME = "evaluateGame";

    public static callFunction = (name: string): firebase.functions.HttpsCallable => {
        const functions = getFunctions(firebaseApp, "europe-west1");
        return httpsCallable(functions, name);
    };
}
