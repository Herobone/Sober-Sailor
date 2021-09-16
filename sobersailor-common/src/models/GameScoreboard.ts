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

import Util from "../Util";

export interface IScoreboard {
  board: Map<string, number>;
}

export type ExternalScoreboard = { [key: string]: number };

export class Scoreboard implements IScoreboard {
  constructor(readonly board: Map<string, number>) {}

  serializeBoard(): ExternalScoreboard {
    return Util.mapToObj(this.board);
  }

  addScore(uid: string, score: number): void {
    this.board.set(uid, score);
  }

  /**
   * Gets the score score of the given player.
   * Returns 0 if the player does not exist. Why care about an non existing player here?
   * @param uid UUID of the player
   */
  getScore(uid: string): number {
    return this.board.get(uid) || 0;
  }

  /**
   * Updates the score of the given player by offset points. If the player does not exist, a new player with offset
   * points will be created
   * @param uid UUID of the player to Update
   * @param offset The score to add to the current score
   * @returns The new score of the player
   */
  updateScore(uid: string, offset: number): number {
    const newScore = this.getScore(uid) + offset;
    this.board.set(uid, newScore);
    return newScore;
  }

  static deserialize(score: ExternalScoreboard): Scoreboard {
    return new Scoreboard(Util.objToMap(score));
  }

  /**
   * Initialize new empty Scoreboard
   */
  static init(): Scoreboard {
    const score = new Map<string, number>();
    return new Scoreboard(score);
  }
}
