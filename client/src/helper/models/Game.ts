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

import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from "firebase/firestore";
import { Game, IGameExternal } from "sobersailor-common/lib/models/Game";
import { Register } from "sobersailor-common/lib/models/Register";
import { EvaluationScoreboard } from "sobersailor-common/lib/models/EvaluationScoreboard";
import { Scoreboard } from "sobersailor-common/lib/models/GameScoreboard";

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
            scoreboard: game.scoreboard.serializeBoard(),
            latestTasks: game.latestTasks,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<IGameExternal<Timestamp>>, options: SnapshotOptions): Game {
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
            Scoreboard.deserialize(data.scoreboard),
            data.latestTasks,
        );
    },
};
