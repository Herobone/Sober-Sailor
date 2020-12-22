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
import {Player, playerConverter} from "./models/Player";

export default class GameManager {

    static createGame(): Promise<string> {
        const auth = firebase.auth();
        const user = auth.currentUser;

        return new Promise<string>((resolve, reject) => {
            if (!user) {
                return reject();
            }

            const uid = user.uid;
            const lenOfUID = uid.length;
            const randomSuffix = Util.randomCharOrNumberSequence((lenOfUID / 2) - 5);
            const gameID = uid.substr(0, 5) + randomSuffix;
            const gameRef = GameManager.getGameByID(gameID);
            gameRef.set({
                currentTask: null,
                type: null,
                round: 0,
                host: uid,
                pollState: false,
                evaluationState: false,
                created: firebase.firestore.Timestamp.now()
            }).then(() => resolve(gameID));
        });
    }

    static getGameByID(gameID: string): firebase.firestore.DocumentReference {
        const db = firebase.firestore();
        return db.collection("games").doc(gameID);
    }

    static joinGame(gameID: string, gameEvent: (doc: firebase.firestore.DocumentSnapshot) => void) {
        const auth = firebase.auth();
        const user = auth.currentUser;

        if (!user) {
            return;
        }

        const uid = user.uid;

        const gameRef = GameManager.getGameByID(gameID);
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

    static leaveGame(gameID: string) {
        const auth = firebase.auth();
        const user = auth.currentUser;

        if (!user) {
            return;
        }

        const uid = user.uid;

        const gameRef = GameManager.getGameByID(gameID);
        GameManager.amIHost(gameID)
            .then((host) => {
                if (host) {
                    GameManager.transferHostShip(gameID)
                        .then(() => {
                            gameRef.collection("players").doc(uid).delete()
                                .then(() => {
                                    console.log("Deleted user from game");
                                    auth.signOut();
                                    window.location.pathname = "";
                                });
                        });
                }

            });
    }

    static amIHost(gameID: string): Promise<boolean> {
        const auth = firebase.auth();
        const user = auth.currentUser;

        return new Promise((resolve, reject) => {
            if (!user) {
                return reject();
            }

            const uid = user.uid;
            const gameRef = GameManager.getGameByID(gameID);
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

    static getAllPlayers(gameID: string): Promise<Player[]> {
        const players: Player[] = [];
        const gameRef = GameManager.getGameByID(gameID);
        const playerRef = gameRef.collection("players");
        return new Promise((resolve, reject) => {
            playerRef.withConverter(playerConverter).get().then((query) => {
                query.forEach((doc) => {
                    players.push(doc.data());
                });
                resolve(players);
            }).catch((error) => reject(error));
        })
    }

    static transferHostShip(gameID: string) {
        const auth = firebase.auth();
        const user = auth.currentUser;
        return new Promise((resolve, reject) => {
            if (!user) {
                return reject();
            }

            const uid = user.uid;
            GameManager.getAllPlayers(gameID)
                .then((players) => {
                    const ids: string[] = [];
                    players.forEach((element: Player) => {
                        if (element.uid !== uid) {
                            ids.push(element.uid);
                        }
                    })
                    const random = Util.getRandomElement(ids);
                    const gameRef = GameManager.getGameByID(gameID);
                    gameRef.update({
                        host: random
                    }).then(resolve).catch(reject);
                });
        });
    }

    static setPollState(gameID: string, state: boolean) {
        return new Promise((resolve, reject) => {
            const gameRef = GameManager.getGameByID(gameID);
            gameRef.update({
                pollState: state
            }).then(resolve).catch(reject);
        });
    }

    static setEvalState(gameID: string, state: boolean) {
        return new Promise((resolve, reject) => {
            const gameRef = GameManager.getGameByID(gameID);
            gameRef.update({
                evaluationState: state
            }).then(resolve).catch(reject);
        });
    }

    static setAnswer(gameID: string, answer: string | null) {
        const auth = firebase.auth();
        const user = auth.currentUser;
        return new Promise((resolve, reject) => {
            if (!user) {
                return reject();
            }

            const uid = user.uid;
            const gameRef = GameManager.getGameByID(gameID);
            gameRef.collection("players").doc(uid).update({
                answer: answer
            }).then(resolve).catch(reject);
        });
    }

    static myAnswerIs(gameID: string, answer: string) {
        return GameManager.setAnswer(gameID, answer);
    }

    static clearMyAnswer(gameID: string) {
        return GameManager.setAnswer(gameID, null);
    }

    static getAllAnswers(gameID: string) {
        return new Promise((resolve, reject) => {

        });
    }
}