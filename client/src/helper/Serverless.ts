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

export class Serverless {
    private static devel = process.env.NODE_ENV === "development";

    public static KICK_PLAYER = "kickPlayer";

    public static SINGLE_TARGET = "singleTarget";

    public static CLOSE_GAME = "closeGame";

    public static callFunction = (name: string): firebase.functions.HttpsCallable =>
        Serverless.devel
            ? firebase.functions().httpsCallable(name)
            : firebase.app().functions("europe-west1").httpsCallable(name);
}
