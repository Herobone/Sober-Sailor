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
import firebase from "firebase";
import { Util } from "./Util";
import { Player, playerConverter } from "./models/Player";
import { Game, gameConverter } from "./models/Game";
import { Register, registerConverter } from "./models/Register";
import { PlayerList } from "./models/CustomTypes";

export class GameManager {
    static getPlayerLookupTable(): Register | null {
        const pltRaw = localStorage.getItem("playerLookupTable");
        if (pltRaw) {
            return Register.parse(pltRaw);
        }

        console.warn("LocalStorage has no PLT stored! Try again!");
        GameManager.getGame()
            .collection("players")
            .doc("register")
            .withConverter(registerConverter)
            .get()
            .then(GameManager.updatePlayerLookupTable)
            .catch(console.error);

        return null;
    }

    static getRandomPlayer(n = 1): PlayerList {
        if (n < 1) {
            throw new RangeError("Can not get fewer than 1 players. That would be kinda stupid");
        }
        const plt = GameManager.getPlayerLookupTable();
        if (!plt) {
            return null;
        }
        const reg = plt.playerUidMap;
        if (n > reg.size) {
            throw new Error(`Trying to get ${n} players while PLT only has ${reg.size} entries`);
        }
        const players: string[] = new Array(n);
        for (let i = 0; i < n; i++) {
            const choose = Util.getRandomKey(reg);
            players.push(choose);
            reg.delete(choose);
        }
        return players;
    }

    static updatePlayerLookupTable(doc: firebase.firestore.DocumentSnapshot<Register>): void {
        const data = doc.data();
        if (data) {
            localStorage.setItem("playerLookupTable", data.stringify());
        }
    }

    static getGameID(): string {
        const gameID = localStorage.getItem("gameID");
        if (!gameID) {
            throw new Error("Game ID not set");
        }
        return gameID;
    }

    static createGame(): Promise<string> {
        const auth = firebase.auth();
        const user = auth.currentUser;

        return new Promise<string>((resolve, reject): void => {
            if (!user) {
                reject();
                return;
            }

            const { uid } = user;
            const lenOfUID = uid.length;
            const randomSuffix = Util.randomCharOrNumberSequence(lenOfUID / 5 - 2);
            const gameID = uid.slice(0, 2) + randomSuffix;
            const gameRef = GameManager.getGameByID(gameID);
            const now: Date = new Date();
            gameRef
                .set(new Game(gameID, null, null, null, 0, 0, uid, false, false, now))
                .then(() => resolve(gameID))
                .catch(reject);
        });
    }

    static getGame(): firebase.firestore.DocumentReference<Game> {
        return GameManager.getGameByID(GameManager.getGameID());
    }

    private static getGameByID(gameID: string): firebase.firestore.DocumentReference<Game> {
        return GameManager.getRawGameByID(gameID).withConverter(gameConverter);
    }

    static getRawGame(): firebase.firestore.DocumentReference {
        return GameManager.getRawGameByID(GameManager.getGameID());
    }

    private static getRawGameByID(gameID: string): firebase.firestore.DocumentReference {
        const db = firebase.firestore();
        return db.collection("games").doc(gameID);
    }

    static joinGame(
        gameEvent: (doc: firebase.firestore.DocumentSnapshot<Game>) => void,
        playerEvent: (doc: firebase.firestore.DocumentSnapshot<Register>) => void,
    ): Promise<unknown> {
        return GameManager.joinGameP(GameManager.getGameID(), gameEvent, playerEvent);
    }

    private static joinGameP(
        gameID: string,
        gameEvent: (doc: firebase.firestore.DocumentSnapshot<Game>) => void,
        playerEvent: (doc: firebase.firestore.DocumentSnapshot<Register>) => void,
    ): Promise<unknown> {
        const auth = firebase.auth();
        const user = auth.currentUser;

        return new Promise((resolve, reject) => {
            if (!user) {
                reject();
                return;
            }

            const { uid } = user;
            const nickname = user.displayName;

            if (!nickname) {
                reject(new Error("User tried to join without name!"));
                return;
            }

            const gameRef = GameManager.getGameByID(gameID);
            const userRef = gameRef.collection("players").doc(uid).withConverter(playerConverter);
            userRef
                .get()
                .then((doc) => {
                    if (!doc.exists) {
                        return userRef.set(new Player(uid, nickname, 0, null));
                    }
                    return Promise.resolve();
                })
                .then(resolve)
                .catch(reject);
            gameRef.onSnapshot(gameEvent);
            gameRef.collection("players").doc("register").withConverter(registerConverter).onSnapshot(playerEvent);
        });
    }

    static leaveGame(): void {
        return GameManager.leaveGameP(GameManager.getGameID());
    }

    private static leaveGameP(gameID: string): void {
        const auth = firebase.auth();
        const user = auth.currentUser;

        if (!user) {
            return;
        }

        const { uid } = user;

        const gameRef = GameManager.getGameByID(gameID);

        const deletePlayer = (): void => {
            gameRef
                .collection("players")
                .doc(uid)
                .delete()
                .then(() => {
                    window.location.pathname = "";
                    return Promise.resolve();
                })
                .catch(console.error);
        };

        localStorage.removeItem("playerLookupTable");
        localStorage.removeItem("gameID");

        GameManager.amIHost()
            .then((host) => {
                if (host) {
                    return GameManager.transferHostShip();
                }
                return Promise.resolve();
            })
            .then(() => deletePlayer())
            .catch(console.error);
    }

    static amIHost(): Promise<boolean> {
        return GameManager.amIHostP(GameManager.getGameID());
    }

    private static amIHostP(gameID: string): Promise<boolean> {
        const auth = firebase.auth();
        const user = auth.currentUser;

        return new Promise((resolve, reject): void => {
            if (!user) {
                reject();
                return;
            }

            const { uid } = user;
            const gameRef = GameManager.getGameByID(gameID);
            gameRef
                .get()
                .then((doc) => {
                    const data = doc.data();
                    if (data) {
                        resolve(data.host === uid);
                    } else {
                        reject();
                    }
                    return Promise.resolve();
                })
                .catch(console.error);
        });
    }

    static getAllPlayers(): Promise<Player[]> {
        return GameManager.getAllPlayersP(GameManager.getGameID());
    }

    private static getAllPlayersP(gameID: string): Promise<Player[]> {
        const players: Player[] = [];
        const gameRef = GameManager.getGameByID(gameID);
        const playerRef = gameRef.collection("players");
        return new Promise((resolve, reject) => {
            playerRef
                .withConverter(playerConverter)
                .get()
                .then((query) => {
                    query.forEach((doc) => {
                        const data = doc.data();
                        if (data && doc.id !== "register") {
                            players.push(data);
                        }
                    });
                    resolve(players);
                    return Promise.resolve();
                })
                .catch((error) => reject(error));
        });
    }

    static transferHostShip(): Promise<unknown> {
        return GameManager.transferHostShipP(GameManager.getGameID());
    }

    private static transferHostShipP(gameID: string): Promise<unknown> {
        const auth = firebase.auth();
        const user = auth.currentUser;
        return new Promise((resolve, reject) => {
            if (!user) {
                reject();
                return;
            }

            const { uid } = user;
            GameManager.getAllPlayers()
                .then((players) => {
                    const ids: string[] = [];
                    players.forEach((element: Player) => {
                        if (element.uid !== uid) {
                            ids.push(element.uid);
                        }
                    });
                    const random = Util.getRandomElement(ids);
                    const gameRef = GameManager.getGameByID(gameID);
                    return gameRef.update({
                        host: random,
                    });
                })
                .then(resolve)
                .catch(reject);
        });
    }

    static setPollState(state: boolean): Promise<unknown> {
        return GameManager.setPollStateP(GameManager.getGameID(), state);
    }

    private static setPollStateP(gameID: string, state: boolean): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const gameRef = GameManager.getGameByID(gameID);
            gameRef
                .update({
                    pollState: state,
                })
                .then(resolve)
                .catch(reject);
        });
    }

    static setEvalState(state: boolean): Promise<unknown> {
        return GameManager.setEvalStateP(GameManager.getGameID(), state);
    }

    private static setEvalStateP(gameID: string, state: boolean): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const gameRef = GameManager.getGameByID(gameID);
            gameRef
                .update({
                    evalState: state,
                })
                .then(resolve)
                .catch(reject);
        });
    }

    static setAnswer(answer: string): Promise<unknown> {
        return GameManager.setAnswerP(GameManager.getGameID(), answer);
    }

    private static setAnswerP(gameID: string, answer: string): Promise<unknown> {
        const auth = firebase.auth();
        const user = auth.currentUser;
        return new Promise((resolve, reject) => {
            if (!user) {
                reject();
                return;
            }

            const { uid } = user;
            const gameRef = GameManager.getGameByID(gameID);
            gameRef
                .collection("players")
                .doc(uid)
                .update({
                    answer,
                })
                .then(resolve)
                .catch(reject);
        });
    }

    static evaluateAnswers(): Promise<Player[]> {
        return new Promise<Player[]>((resolve, reject) => {
            GameManager.getAllPlayers()
                .then((players: Player[]) => {
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
                            reject(new Error("Name was not in map. So the answer was not a current player"));
                            return;
                        }
                        const theirAnswer = playerAnwered.get(uid);
                        if (!theirAnswer) {
                            reject(new Error("Well, fuck. That is an error that should not happen. Memory leak?"));
                            return;
                        }
                        const theirAnswerReadable = idNameMap.get(theirAnswer);
                        if (!theirAnswerReadable) {
                            reject(new Error("Well, fuck. That is an error that should not happen. Memory leak?"));
                            return;
                        }
                        sipsPerPlayer.push(new Player(uid, name, count, theirAnswerReadable));
                    });

                    const occuredKeys = new Set([...occur.keys()]);
                    idNameMap.forEach((name: string, uid: string) => {
                        if (!occuredKeys.has(uid)) {
                            const theirAnswer = playerAnwered.get(uid);
                            if (!theirAnswer) {
                                reject(new Error("Well, fuck. That is an error that should not happen. Memory leak?"));
                                return;
                            }
                            const theirAnswerReadable = idNameMap.get(theirAnswer);
                            if (!theirAnswerReadable) {
                                reject(new Error("Well, fuck. That is an error that should not happen. Memory leak?"));
                                return;
                            }
                            sipsPerPlayer.push(new Player(uid, name, 0, theirAnswerReadable));
                        }
                    });

                    resolve(sipsPerPlayer);
                    return Promise.resolve();
                })
                .catch(reject);
        });
    }

    static getMyData(): Promise<Player> {
        return GameManager.getMyDataP(GameManager.getGameID());
    }

    private static getMyDataP(gameID: string): Promise<Player> {
        const gameRef = GameManager.getGameByID(gameID);
        const auth = firebase.auth();
        const user = auth.currentUser;
        return new Promise((resolve, reject) => {
            if (!user) {
                reject();
                return;
            }

            const { uid } = user;
            const playerRef = gameRef.collection("players").doc(uid);
            playerRef
                .withConverter(playerConverter)
                .get()
                .then((doc) => {
                    const data = doc.data();
                    if (data) {
                        resolve(data);
                    } else {
                        reject(new Error("Player not found"));
                    }
                    return Promise.resolve();
                })
                .catch(reject);
        });
    }

    static afterEval(results: Player[]): Promise<unknown> {
        let sipsIHaveToTake = 0;
        const auth = firebase.auth();
        const user = auth.currentUser;
        return new Promise((resolve, reject) => {
            if (!user) {
                reject();
                return;
            }

            const { uid } = user;
            results.forEach((player: Player) => {
                if (player.uid === uid) {
                    sipsIHaveToTake = player.sips;
                }
            });
            GameManager.getMyData()
                .then((data: Player) => {
                    const gameRef = GameManager.getGame();
                    const sipsToSubmit = data.sips + sipsIHaveToTake;
                    return gameRef.collection("players").doc(uid).update({
                        sips: sipsToSubmit,
                        answer: null,
                    });
                })
                .then(resolve)
                .catch(reject);
        });
    }
}
