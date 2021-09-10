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

import { QueryDocumentSnapshot, SnapshotOptions, DocumentData, Timestamp } from "firebase/firestore";
import { EvaluationScoreboard } from "../../../../common/src/models/EvaluationScoreboard";
import { Game } from "../../../../common/src/models/Game";
import { Register } from "../../../../common/src/models/Register";

interface IGameExternal {
    currentTask: string | null;
    type: string | null;
    taskTarget: string | null;
    penalty: number;
    round: number;
    host: string;
    pollState: boolean;
    evalState: boolean;
    created: Timestamp;
    playerUidMap: { [key: string]: string };
    evaluationScoreboard: { [key: string]: number };
    evaluationAnswers: { [key: string]: string };
}

export const gameConverter = {
    toFirestore(game: Game): DocumentData {
        return {
            currentTask: game.currentTask,
            type: game.type,
            taskTarget: game.taskTarget,
            penalty: game.penalty,
            round: game.round,
            host: game.host,
            pollState: game.pollState,
            evalState: game.evalState,
            created: Timestamp.fromDate(game.created),
            playerUidMap: game.register.serialize(),
            evaluationScoreboard: game.evaluationScoreboard.serializeScore(),
            evaluationAnswers: game.evaluationScoreboard.serializeAnswers(),
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<IGameExternal>, options: SnapshotOptions): Game {
        const data = snapshot.data(options);
        return new Game(
            snapshot.id,
            data.currentTask,
            data.type,
            data.taskTarget,
            data.penalty,
            data.round,
            data.host,
            data.pollState,
            data.evalState,
            data.created.toDate(),
            Register.deserialize(data.playerUidMap),
            EvaluationScoreboard.deserialize(data.evaluationScoreboard, data.evaluationAnswers),
        );
    },
};
