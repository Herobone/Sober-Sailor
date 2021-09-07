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
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";
import { Util } from "./Util";
import { Player, playerConverter } from "./models/Player";
import { Game, gameConverter } from "./models/Game";
import { Register } from "./models/Register";
import { PlayerList } from "./models/CustomTypes";
import { Serverless } from "./Serverless";

export class GameManager {
    static getPlayerLookupTable(): Register | null {
        const pltRaw = localStorage.getItem("playerLookupTable");
        if (pltRaw) {
            return Register.parse(pltRaw);
        }

        console.warn("LocalStorage has no PLT stored! Try again!");
        GameManager.getGame().get().then(GameManager.updatePlayerLookupTable).catch(console.error);

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
        const players: string[] = Array.from({ length: n });
        // console.log(`Array length ${players.length} with n=${n}`);
        for (let i = 0; i < n; i++) {
            const choose = Util.getRandomKey(reg);
            // console.log(`Current iteration: ${i} has chosen ${choose}`);
            players[i] = choose;
            reg.delete(choose);
        }
        return players;
    }

    static updatePlayerLookupTable(doc: firebase.firestore.DocumentSnapshot<Game>): void {
        const data = doc.data();
        if (data) {
            localStorage.setItem("playerLookupTable", data.register.stringify());
        }
    }

    static getGameID(): string {
        const gameID = localStorage.getItem("gameID");
        if (!gameID) {
            throw new Error("Game ID not set");
        }
        return gameID;
    }

    static async createGame(): Promise<string> {
        const { currentUser } = firebase.auth();

        if (!currentUser) {
            throw new Error("User not logged in");
        }

        const { uid } = currentUser;
        const lenOfUID = uid.length;
        const randomSuffix = Util.randomCharOrNumberSequence(lenOfUID / 5 - 2);
        const gameID = uid.slice(0, 2) + randomSuffix;
        const gameRef = GameManager.getGameByID(gameID);
        try {
            await gameRef.set(Game.createEmpty(gameID, currentUser));
        } catch (error) {
            console.error(error);
        }
        return gameID;
    }

    static getGame(): firebase.firestore.DocumentReference<Game> {
        return GameManager.getGameByID(GameManager.getGameID());
    }

    private static getGameByID(gameID: string): firebase.firestore.DocumentReference<Game> {
        const db = firebase.firestore();
        return db.collection("games").doc(gameID).withConverter(gameConverter);
    }

    static getPlayerCol(): firebase.firestore.CollectionReference {
        return GameManager.getGame().collection("players");
    }

    static getPlayer(uid: string): firebase.firestore.DocumentReference<Player> {
        return GameManager.getPlayerCol().doc(uid).withConverter(playerConverter);
    }

    static async joinGame(gameEvent: (doc: firebase.firestore.DocumentSnapshot<Game>) => void): Promise<void> {
        const auth = firebase.auth();
        const user = auth.currentUser;

        if (!user) {
            throw new Error("Unauthenticated");
        }

        const { uid, displayName } = user;
        const nickname = displayName;

        if (!nickname) {
            throw new Error("User tried to join without name!");
        }

        const gameRef = GameManager.getGame();
        const userRef = GameManager.getPlayer(uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            await userRef.set(new Player(uid, nickname, 0, null));
        }
        gameRef.onSnapshot(gameEvent);
    }

    public static removeLocalData(): void {
        localStorage.removeItem("playerLookupTable");
        localStorage.removeItem("gameID");
    }

    static leaveGame(): void {
        const auth = firebase.auth();
        const user = auth.currentUser;

        if (!user) {
            return;
        }

        const { uid } = user;

        const deletePlayer = (): void => {
            GameManager.getPlayer(uid)
                .delete()
                .then(() => {
                    window.location.pathname = "";
                    GameManager.removeLocalData();
                    return Promise.resolve();
                })
                .catch(console.error);
        };

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

    static async amIHost(): Promise<boolean> {
        const auth = firebase.auth();
        const user = auth.currentUser;

        if (!user) {
            throw new Error("Unauthenticated");
        }

        const { uid } = user;
        const gameRef = GameManager.getGame();
        const gameDoc = await gameRef.get();
        const data = gameDoc.data();
        if (data) {
            return data.host === uid;
        }
        throw new Error("No data in document!");
    }

    static async getAllPlayers(): Promise<Player[]> {
        const players: Player[] = [];
        const playerRef = GameManager.getPlayerCol().withConverter(playerConverter);

        const query = await playerRef.get();
        query.forEach((doc) => {
            const data = doc.data();
            if (data) {
                players.push(data);
            }
        });
        return players;
    }

    static async transferHostShip(): Promise<void> {
        const auth = firebase.auth();
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Unauthenticated");
        }

        const { uid } = user;
        const players = await GameManager.getAllPlayers();

        const ids: string[] = [];
        players.forEach((element: Player) => {
            if (element.uid !== uid) {
                ids.push(element.uid);
            }
        });

        const gameRef = GameManager.getGame();
        if (ids.length > 0) {
            console.log("Some players left! Transferring!");
            const random = Util.getRandomElement(ids);
            await gameRef.update({
                host: random,
            });
            return;
        }

        console.log("No players left! Closing!");
        await Serverless.callFunction(Serverless.CLOSE_GAME)({
            gameID: GameManager.getGameID(),
        });
    }

    static async setPollState(state: boolean): Promise<void> {
        console.log("Changing State to", state);
        const gameRef = GameManager.getGame();
        await gameRef.update({
            pollState: state,
        });
    }

    static async setEvalState(state: boolean): Promise<void> {
        const gameRef = GameManager.getGame();
        await gameRef.update({
            evalState: state,
        });
    }

    static async setAnswer(answer: string): Promise<void> {
        const auth = firebase.auth();
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Unauthenticated");
        }

        const { uid } = user;
        await GameManager.getPlayer(uid).update({
            answer,
        });
    }

    /**
     * Evaluates the Answers of all Players and distributes sips according to who was voted the most
     * */
    static async evaluateAnswers(): Promise<Player[]> {
        const players = await GameManager.getAllPlayers();
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
                throw new Error("Name was not in map. So the answer was not a current player");
            }
            const theirAnswer = playerAnwered.get(uid);
            if (!theirAnswer) {
                throw new Error("Well, fuck. That is an error that should not happen. Memory leak?");
            }
            const theirAnswerReadable = idNameMap.get(theirAnswer);
            if (!theirAnswerReadable) {
                throw new Error("Well, fuck. That is an error that should not happen. Memory leak?");
            }
            sipsPerPlayer.push(new Player(uid, name, count, theirAnswerReadable));
        });

        const occuredKeys = new Set(occur.keys());
        idNameMap.forEach((name: string, uid: string) => {
            if (!occuredKeys.has(uid)) {
                const theirAnswer = playerAnwered.get(uid);
                if (!theirAnswer) {
                    throw new Error("Well, fuck. That is an error that should not happen. Memory leak?");
                }
                const theirAnswerReadable = idNameMap.get(theirAnswer);
                if (!theirAnswerReadable) {
                    throw new Error("Well, fuck. That is an error that should not happen. Memory leak?");
                }
                sipsPerPlayer.push(new Player(uid, name, 0, theirAnswerReadable));
            }
        });

        return sipsPerPlayer;
    }

    static async getMyData(): Promise<Player> {
        const auth = firebase.auth();
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Unauthenticated");
        }

        const { uid } = user;
        const playerRef = GameManager.getPlayer(uid);
        const doc = await playerRef.withConverter(playerConverter).get();
        const data = doc.data();
        if (data) {
            return data;
        }
        throw new Error("Player not found");
    }

    /**
     * Increment sips and reset answer
     * @param results   The results that were calculated for the given round
     */
    static submitPenaltyAndReset(results: Player[]): Promise<void> {
        let sipsIHaveToTake = 0;
        const auth = firebase.auth();
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Unauthenticated call to protected function!");
        }

        const { uid } = user;
        results.forEach((player: Player) => {
            if (player.uid === uid) {
                sipsIHaveToTake = player.sips;
            }
        });
        return GameManager.getPlayer(uid).update({
            sips: firebase.firestore.FieldValue.increment(sipsIHaveToTake),
            answer: null,
        });
    }
}
