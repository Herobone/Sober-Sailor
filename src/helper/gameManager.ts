/*****************************
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
import firebase from "firebase";
import Util from "./Util";

export function createGame(): Promise<string> {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const user = auth.currentUser;

    return new Promise<string>((resolve, reject) => {
        if (!user) {
            return reject();
        }

        const uid = user.uid;
        const lenOfUID = uid.length;
        const randomSuffix = Util.randomCharOrNumberSequence((lenOfUID / 2) - 5);
        const gameID = uid.substr(0, 5) + randomSuffix;
        const gameRef = getGameByID(gameID);
        gameRef.set({
            currentTask: null,
            type: null,
            round: 0,
            host: uid,
            created: firebase.firestore.Timestamp.now()
        }).then(() => resolve(gameID));
    });
}

export function getGameByID(gameID: string): firebase.firestore.DocumentReference {
    const db = firebase.firestore();
    return db.collection("games").doc(gameID);
}

export function joinGame(gameID: string, gameEvent: (doc: firebase.firestore.DocumentSnapshot) => void) {
    const auth = firebase.auth();
    const user = auth.currentUser;

    if (!user) {
        return;
    }

    const uid = user.uid;

    const gameRef = getGameByID(gameID);
    const userRef = gameRef.collection("players").doc(uid);
    userRef.get().then((doc) => {
        if (!doc.exists) {
            userRef.set({
                sips: 0,
                nickname: user.displayName
            }).then(() => console.log("Success"));
        }
    })
    gameRef.onSnapshot(gameEvent);
}

export function leaveGame(gameID: string) {
    const auth = firebase.auth();
    const user = auth.currentUser;

    if (!user) {
        return;
    }

    const uid = user.uid;

    const gameRef = getGameByID(gameID);
    gameRef.collection("players").doc(uid).delete().then(() => {
        console.log("Deleted user from game");
        auth.signOut();
        window.location.pathname = "";
    });
}

export function amIHost(gameID: string): Promise<boolean> {
    const auth = firebase.auth();
    const user = auth.currentUser;

    return new Promise((resolve, reject) => {
        if (!user) {
            return reject();
        }

        const uid = user.uid;
        const gameRef = getGameByID(gameID);
        gameRef.get().then((doc) => {
            const data = doc.data();
            if (data) {
                resolve(data.host === uid);
            } else {
                reject();
            }
        });
    });
}

export function getAllPlayers(gameID: string): Promise<Map<string, string>> {
    const players = new Map<string, string>();
    const gameRef = getGameByID(gameID);
    const playerRef = gameRef.collection("players");
    return new Promise((resolve, reject) => {
        playerRef.get().then((query) => {
            query.forEach((doc) => {
                const data = doc.data()
                players.set(doc.id, data.nickname);
            });
            resolve(players);
        }).catch((error) => reject(error));
    })
}

export function transferHostShip(gameID: string) {
    const auth = firebase.auth();
    const user = auth.currentUser;
    return new Promise((resolve, reject) => {
        if (!user) {
            return reject();
        }

        const uid = user.uid;
        getAllPlayers(gameID).then((players) => {
            players.delete(uid);
            const random = Util.getRandomKey(players);
            const gameRef = getGameByID(gameID);
            gameRef.update({
                host: random
            }).then(resolve).catch(reject);
        });
    });
}

export function myAnswerIs(gameID: string, answer: string) {
    const auth = firebase.auth();
    const user = auth.currentUser;
    return new Promise((resolve, reject) => {
        if (!user) {
            return reject();
        }

        const uid = user.uid;
        const gameRef = getGameByID(gameID);
        gameRef.collection("players").doc(uid).update({
            answer: answer
        }).then(resolve);
    });
}