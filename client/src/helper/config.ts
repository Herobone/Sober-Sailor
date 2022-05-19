/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020-2022.
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
import { initializeApp } from "firebase/app";

const betaConfig = {
    apiKey: "AIzaSyAsjpgvg6fA8icaGSNxYinPoqh08uLQG0A",
    authDomain: "sober-sailor-beta.firebaseapp.com",
    projectId: "sober-sailor-beta",
    storageBucket: "sober-sailor-beta.appspot.com",
    messagingSenderId: "937950228213",
    appId: "1:937950228213:web:ccaef905322dda1ef39fbc",
    measurementId: "G-9W6H706GK7",
};
const productionConfig = {
    apiKey: "AIzaSyDK2kzipgJdsN3PLMGoWIdtvJXj0-jqHu8",
    authDomain: "sober-sailor.firebaseapp.com",
    projectId: "sober-sailor",
    storageBucket: "sober-sailor.appspot.com",
    messagingSenderId: "922767796924",
    appId: "1:922767796924:web:c224574e42c431d1bd7eb9",
    measurementId: "G-1G0EXE06XV",
};
export const config = process.env.REACT_APP_BETA_CHANNEL === "true" ? betaConfig : productionConfig;
export const firebaseApp = initializeApp(config);
