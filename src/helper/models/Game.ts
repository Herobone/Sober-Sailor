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

export interface IGame {
    gameID: string;
    currentTask: string | null;
    type: string | null;
    taskTarget: string | null;
    round: number;
    host: string;
    pollState: boolean;
    evalState: boolean;
    created: Date;
}

interface IGameExternal {
    currentTask: string | null;
    type: string | null;
    taskTarget: string | null;
    round: number;
    host: string;
    pollState: boolean;
    evalState: boolean;
    created: firebase.firestore.Timestamp;
}

export class Game implements IGame {

    constructor(
        readonly gameID: string,
        readonly currentTask: string | null,
        readonly type: string | null,
        readonly taskTarget: string | null,
        readonly round: number,
        readonly host: string,
        readonly pollState: boolean,
        readonly evalState: boolean,
        readonly created: Date
    ) { }

}

export const gameConverter = {
    toFirestore(game: Game): firebase.firestore.DocumentData {
        return {
            currentTask: game.currentTask,
            type: game.type,
            taskTarget: game.taskTarget,
            round: game.round,
            host: game.host,
            pollState: game.pollState,
            evalState: game.evalState,
            created: firebase.firestore.Timestamp.fromDate(game.created)
        }
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot<IGameExternal>,
        options: firebase.firestore.SnapshotOptions
    ): Game {
        const data = snapshot.data(options);
        return new Game(
            snapshot.id,
            data.currentTask,
            data.type,
            data.taskTarget,
            data.round,
            data.host,
            data.pollState,
            data.evalState,
            data.created.toDate()
        );
    }
}