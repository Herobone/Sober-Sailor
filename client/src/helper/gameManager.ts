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
import { Player, playerConverter } from "./models/Player";
import { Game, gameConverter } from "./models/Game";
import { Register, registerConverter } from "./models/Register";

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
            const now: Date = new Date();
            console.log(now);
            gameRef.set(new Game(gameID, null, null, null, 0, uid, false, false, now)).then(() => resolve(gameID));
        });
    }

    static getGameByID(gameID: string): firebase.firestore.DocumentReference<Game> {
        return GameManager.getRawGameByID(gameID).withConverter(gameConverter);
    }

    static getRawGameByID(gameID: string): firebase.firestore.DocumentReference {
        const db = firebase.firestore();
        return db.collection("games").doc(gameID);
    }

    static joinGame(gameID: string,
        gameEvent: (doc: firebase.firestore.DocumentSnapshot<Game>) => void,
        playerEvent: (doc: firebase.firestore.DocumentSnapshot<Register>) => void) {
        const auth = firebase.auth();
        const user = auth.currentUser;

        return new Promise((resolve, reject) => {
            if (!user) {
                return reject();
            }

            const uid = user.uid,
                nickname = user.displayName;

            if (!nickname) {
                return reject("User tried to join without name!");
            }

            const gameRef = GameManager.getGameByID(gameID);
            const userRef = gameRef.collection("players").doc(uid).withConverter(playerConverter);
            userRef.get().then((doc) => {
                if (!doc.exists) {
                    userRef.set(new Player(uid, nickname, 0, null)).then(resolve).catch(reject);
                }
            }).catch(reject);
            gameRef.onSnapshot(gameEvent);
            gameRef.collection("players").doc("register").withConverter(registerConverter).onSnapshot(playerEvent);
        });
    }

    static leaveGame(gameID: string) {
        const auth = firebase.auth();
        const user = auth.currentUser;

        if (!user) {
            return;
        }

        const uid = user.uid;

        const gameRef = GameManager.getGameByID(gameID);

        const deletePlayer = () => {
            gameRef.collection("players").doc(uid).delete()
                .then(() => {
                    console.log("Deleted user from game");
                    auth.signOut();
                    window.location.pathname = "";
                });
        }

        localStorage.removeItem("playerLookupTable");

        GameManager.amIHost(gameID)
            .then((host) => {
                if (host) {
                    GameManager.transferHostShip(gameID)
                        .then(() => {
                            deletePlayer();
                        });
                } else {
                    deletePlayer();
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
                    const data = doc.data();
                    if (data && doc.id !== "register") {
                        players.push(data);
                    }
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
                evalState: state
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

    static evaluateAnswers(gameID: string): Promise<Player[]> {
        return new Promise<Player[]>((resolve, reject) => {
            GameManager.getAllPlayers(gameID).then((players: Player[]) => {
                const answers: string[] = [];
                const idNameMap: Map<string, string> = new Map();
                const playerAnwered: Map<string, string> = new Map();
                players.forEach((player: Player) => {
                    idNameMap.set(player.uid, player.nickname);
                    if (player.answer) {
                        answers.push(player.answer);
                        playerAnwered.set(player.uid, player.answer);
                    } else {
                        answers.push(player.uid);
                        playerAnwered.set(player.uid, player.uid);
                    }
                });
                const occur = Util.countOccurences(answers);
                const sipsPerPlayer: Player[] = [];
                occur.forEach((count: number, uid: string) => {
                    const name = idNameMap.get(uid);
                    if (!name) {
                        return reject("Name was not in map. So the answer was not a current player");
                    }
                    const theirAnswer = playerAnwered.get(uid);
                    if (!theirAnswer) {
                        return reject("Well, fuck. That is an error that should not happen. Memory leak?")
                    }
                    const theirAnswerReadable = idNameMap.get(theirAnswer);
                    if (!theirAnswerReadable) {
                        return reject("Well, fuck. That is an error that should not happen. Memory leak?")
                    }
                    sipsPerPlayer.push(new Player(uid, name, count, theirAnswerReadable));
                });

                let occuredKeys = Array.from(occur.keys());
                idNameMap.forEach((name: string, uid: string) => {
                    if (occuredKeys.indexOf(uid) < 0) {

                        const theirAnswer = playerAnwered.get(uid);
                        if (!theirAnswer) {
                            return reject("Well, fuck. That is an error that should not happen. Memory leak?")
                        }
                        const theirAnswerReadable = idNameMap.get(theirAnswer);
                        if (!theirAnswerReadable) {
                            return reject("Well, fuck. That is an error that should not happen. Memory leak?")
                        }
                        sipsPerPlayer.push(new Player(uid, name, 0, theirAnswerReadable));
                    }
                });

                resolve(sipsPerPlayer);
            }).catch(reject);
        })
    }

    static getMyData(gameID: string): Promise<Player> {
        const gameRef = GameManager.getGameByID(gameID);
        const auth = firebase.auth();
        const user = auth.currentUser;
        return new Promise((resolve, reject) => {
            if (!user) {
                return reject();
            }

            const uid = user.uid;
            const playerRef = gameRef.collection("players").doc(uid);
            playerRef.withConverter(playerConverter).get().then((doc) => {
                const data = doc.data();
                if (data) {
                    resolve(data);
                } else {
                    reject("Player not found");
                }
            }).catch(reject);
        })
    }

    static afterEval(gameID: string, results: Player[]) {
        let sipsIHaveToTake = 0;
        const auth = firebase.auth();
        const user = auth.currentUser;
        return new Promise((resolve, reject) => {
            if (!user) {
                return reject();
            }

            const uid = user.uid;
            results.forEach((player: Player) => {
                if (player.uid === uid) {
                    sipsIHaveToTake = player.sips;
                }
            });
            GameManager.getMyData(gameID).then((data: Player) => {
                const gameRef = GameManager.getGameByID(gameID);
                const sipsToSubmit = data.sips + sipsIHaveToTake;
                gameRef.collection("players").doc(uid).update({
                    sips: sipsToSubmit,
                    answer: null
                }).then(resolve).catch(reject);
            });
        });
    }
}