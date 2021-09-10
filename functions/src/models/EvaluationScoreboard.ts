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

import Util from "../helper/Util";

export interface IEvaluationScoreboard {
  board: Map<string, number>;
  answers: Map<string, string>;
}

export class EvaluationScoreboard implements IEvaluationScoreboard {
  constructor(
    readonly board: Map<string, number>,
    readonly answers: Map<string, string>
  ) {}

  serializeScore(): { [key: string]: number } {
    return Util.mapToObj(this.board);
  }

  serializeAnswers(): { [key: string]: string } {
    return Util.mapToObj(this.answers);
  }

  addScore(uid: string, score: number): void {
    this.board.set(uid, score);
  }

  addAnswer(uid: string, answer: string): void {
    this.answers.set(uid, answer);
  }

  static deserialize(
    score: { [key: string]: number },
    answers: { [key: string]: string }
  ): EvaluationScoreboard {
    return new EvaluationScoreboard(
      Util.objToMap(score),
      Util.objToMap(answers)
    );
  }

  /**
   * Initialize new empty EvaluationScoreboard
   */
  static init(): EvaluationScoreboard {
    const score = new Map<string, number>();
    const answers = new Map<string, string>();
    return new EvaluationScoreboard(score, answers);
  }
}
