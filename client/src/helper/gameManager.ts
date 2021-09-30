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

import {
    getFirestore,
    doc,
    getDoc,
    DocumentReference,
    setDoc,
    collection,
    CollectionReference,
    deleteDoc,
    getDocs,
    updateDoc,
    increment,
    DocumentSnapshot,
    Unsubscribe,
    onSnapshot,
    FirestoreError,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Register } from "sobersailor-common/lib/models/Register";
import { Game } from "sobersailor-common/lib/models/Game";
import { Player } from "sobersailor-common/lib/models/Player";
import Util from "sobersailor-common/lib/Util";
import { PlayerList } from "sobersailor-common/lib/models/PlayerList";
import { tasks } from "../gamemodes/tasks";
import { playerConverter } from "./models/Player";
import { gameConverter } from "./models/Game";
import { Serverless } from "./Serverless";
import { firebaseApp } from "./config";
import { TaskUtils } from "./TaskUtils";

export class GameManager {
    static getPlayerLookupTable(): Register | null {
        const pltRaw = localStorage.getItem("playerLookupTable");
        if (pltRaw) {
            return Register.parse(pltRaw);
        }

        console.warn("LocalStorage has no PLT stored! Try again!");
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

    static updatePlayerLookupTable(data: Game): void {
        localStorage.setItem("playerLookupTable", data.register.stringify());
    }

    static getGameID(): string {
        const gameID = localStorage.getItem("gameID");
        if (!gameID) {
            throw new Error("Game ID not set");
        }
        return gameID;
    }

    static async createGame(): Promise<string> {
        const { currentUser } = getAuth(firebaseApp);

        if (!currentUser) {
            throw new Error("User not logged in");
        }

        const { uid, displayName } = currentUser;
        if (!displayName) {
            throw new Error("Display name missing");
        }
        const lenOfUID = uid.length;
        const randomSuffix = Util.randomCharOrNumberSequence(lenOfUID / 5 - 2);
        const gameID = uid.slice(0, 2) + randomSuffix;
        const gameRef = GameManager.getGameByID(gameID);
        try {
            await setDoc(gameRef, Game.createEmpty(gameID, uid, displayName));
        } catch (error) {
            console.error(error);
        }
        return gameID;
    }

    static getGame(): DocumentReference<Game> {
        return GameManager.getGameByID(GameManager.getGameID());
    }

    private static getGameByID(gameID: string): DocumentReference<Game> {
        const db = getFirestore(firebaseApp);
        return doc(db, "games", gameID).withConverter(gameConverter);
    }

    static getPlayerCol(): CollectionReference {
        return collection(GameManager.getGame(), "players");
    }

    static getPlayer(uid: string): DocumentReference<Player> {
        return doc(GameManager.getPlayerCol(), uid).withConverter(playerConverter);
    }

    /**
     * This function will handle the join event. It will create a new Player object in the __players__ collection. It
     * also attaches a event handler to the main game Document that is used to update the state
     * @param gameEvent The Event Handler
     * @param onSnapshotError The Error Handler
     */
    static async joinGame(
        gameEvent: (doc: DocumentSnapshot<Game>) => void,
        onSnapshotError: (error: FirestoreError) => void,
    ): Promise<Unsubscribe> {
        const auth = getAuth(firebaseApp);
        const user = auth.currentUser;

        if (!user) {
            throw new Error("Unauthenticated");
        }

        const { uid, displayName } = user;
        const nickname = displayName;

        if (!nickname) {
            throw new Error("User tried to join without name!");
        }

        try {
            const userRef = GameManager.getPlayer(uid);
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                await setDoc(userRef, new Player(uid, nickname, 0, null));
            }
        } catch (error) {
            console.warn("Problem writing to Database! Either offline or missing permissions!");
            console.error(error);
        }

        // Preload tasks in English
        for (const task of tasks) {
            if (task.id === "tictactoe") continue;
            await (task.multiAnswer
                ? TaskUtils.storeLocalFromGitMultiAnswer(task.id, "en")
                : TaskUtils.storeToLocalFromGit(task.id, "en"));
        }

        const gameRef = GameManager.getGame();
        const unsubscribe = onSnapshot(gameRef, gameEvent, onSnapshotError);
        console.log("Snapshot listener added");
        const data = await getDoc(gameRef);
        gameEvent(data);
        return unsubscribe;
    }

    public static removeLocalData(): void {
        localStorage.removeItem("playerLookupTable");
        localStorage.removeItem("gameID");
    }

    static leaveGame(): void {
        const auth = getAuth(firebaseApp);
        const user = auth.currentUser;

        if (!user) {
            return;
        }

        const { uid } = user;

        const deletePlayer = (): void => {
            deleteDoc(GameManager.getPlayer(uid))
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

    /**
     * Checks if the current user is the host of the game. This fetches the current game document from Firestore and
     * compares uids. <br />
     * **IMPORTANT**: This provides no security! This only should be used to display certain UI Elements that are dedicated
     * to the host!
     * @return Promise<boolean> Is the current user host?
     * @throws Error If user was not Authenticated (which should not happen) or if the game document was empty (Happens
     * if the game was ended)
     */
    static async amIHost(): Promise<boolean> {
        const auth = getAuth(firebaseApp);
        const user = auth.currentUser;

        if (!user) {
            throw new Error("Unauthenticated");
        }

        const { uid } = user;
        const gameRef = GameManager.getGame();
        const gameDoc = await getDoc(gameRef);
        const data = gameDoc.data();
        if (data) {
            return data.host === uid;
        }
        throw new Error("No data in document!");
    }

    static async getAllPlayers(): Promise<Player[]> {
        const players: Player[] = [];
        const playerRef = GameManager.getPlayerCol().withConverter(playerConverter);

        const queryIn = await getDocs(playerRef);
        queryIn.forEach((docIn) => {
            const data = docIn.data();
            if (data) {
                players.push(data);
            }
        });
        return players;
    }

    static async transferHostShip(): Promise<void> {
        const auth = getAuth(firebaseApp);
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
            await updateDoc(gameRef, {
                host: random,
            });
            // store.dispatch(setHost(false));
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
        await updateDoc(gameRef, {
            pollState: state,
        });
    }

    static async setEvalState(state: boolean): Promise<void> {
        const gameRef = GameManager.getGame();
        await updateDoc(gameRef, {
            evalState: state,
        });
    }

    static async setAnswer(answer: string): Promise<void> {
        const auth = getAuth(firebaseApp);
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Unauthenticated");
        }

        const { uid } = user;
        await updateDoc(GameManager.getPlayer(uid), {
            answer,
        });
    }

    static async getMyData(): Promise<Player> {
        const auth = getAuth(firebaseApp);
        const user = auth.currentUser;
        if (!user) {
            throw new Error("Unauthenticated");
        }
        try {
            const { uid } = user;
            const playerRef = GameManager.getPlayer(uid);
            const docIn = await getDoc(playerRef.withConverter(playerConverter));
            const data = docIn.data();
            if (data) {
                return data;
            }
        } catch (error) {
            console.error("An error occurred while fetching player data!");
            console.error(error);
        }

        throw new Error("Player not found");
    }

    /**
     * Increment sips and reset answer
     * @param results   The results that were calculated for the given round
     */
    static submitPenaltyAndReset(results: Player[]): Promise<void> {
        let sipsIHaveToTake = 0;
        const auth = getAuth(firebaseApp);
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
        return updateDoc(GameManager.getPlayer(uid), {
            sips: increment(sipsIHaveToTake),
            answer: null,
        });
    }
}
