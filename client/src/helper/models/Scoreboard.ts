/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2021.
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
import { Util } from "../Util";

export interface IScoreboard {
    board: Map<string, number>;
    answers: Map<string, string>;
}

export class Scoreboard implements IScoreboard {
    constructor(readonly board: Map<string, number>, readonly answers: Map<string, string>) {}

    serializeScore(): { [key: string]: number } {
        return Util.mapToObj(this.board);
    }

    serializeAnswers(): { [key: string]: string } {
        return Util.mapToObj(this.answers);
    }

    addScore(uid: string, score: number): void {
        this.board.set(uid, score);
    }

    static deserialize(score: { [key: string]: number }, answers: { [key: string]: string }): Scoreboard {
        return new Scoreboard(Util.objToMap(score), Util.objToMap(answers));
    }

    /**
     * Initialize new Register with one entry
     * @param uid   Player UID
     * @param name  Player Name
     */
    static init(): Scoreboard {
        const score = new Map<string, number>();
        const answers = new Map<string, string>();
        return new Scoreboard(score, answers);
    }
}
