/** ***************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020.
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

import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/compat/app";
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import * as serviceWorker from "./serviceWorker";
import { config, firebaseApp } from "./helper/config";
import { App } from "./App";
import { Dough } from "./helper/Dough";

// Initialize Firebase with the config
// Configure in helper/config.ts
firebase.initializeApp(config);
const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence).catch(console.error);

// If running local use Emulators for testing!
// Make sure to start those with "firebase emulators:start"
if (process.env.NODE_ENV !== "production") {
    console.log("Connecting to emulators!");
    const db = getFirestore(firebaseApp);
    const fn = getFunctions(firebaseApp, "europe-west1");
    connectFirestoreEmulator(db, window.location.hostname, 8080);
    connectAuthEmulator(auth, `http://${window.location.hostname}:9099`);
    connectFunctionsEmulator(fn, window.location.hostname, 5001);
}

if (process.env.REACT_APP_BETA_CHANNEL) {
    console.warn("This is the BETA version!");
}

Dough.startAnalytics();

ReactDOM.render(
    <App />,
    // Get the "root" Element from index.html
    document.querySelector("#root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
