import { Register } from "./Register";
import { Scoreboard, ExternalScoreboard } from "./GameScoreboard";
import { ExternalRegister } from "./Register";
import {
  ExternalAnswers,
  ExternalEvaluationScoreboard,
  EvaluationScoreboard,
} from "./EvaluationScoreboard";

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

export interface IGame {
  gameID: string;
  currentTask: string | null;
  type: string | null;
  taskTarget: string | null;
  penalty: number;
  round: number;
  host: string;
  pollState: boolean;
  evalState: boolean;
  created: Date;
  register: Register;
  evaluationScoreboard: EvaluationScoreboard;
  scoreboard: Scoreboard;
}

export interface IGameExternal<TimeStampClass> {
  currentTask: string | null;
  type: string | null;
  taskTarget: string | null;
  penalty: number;
  round: number;
  host: string;
  pollState: boolean;
  evalState: boolean;
  created: TimeStampClass;
  playerUidMap: ExternalRegister;
  evaluationScoreboard: ExternalEvaluationScoreboard;
  evaluationAnswers: ExternalAnswers;
  scoreboard: ExternalScoreboard;
}

export class Game implements IGame {
  constructor(
    readonly gameID: string,
    readonly currentTask: string | null,
    readonly type: string | null,
    readonly taskTarget: string | null,
    readonly penalty: number,
    readonly round: number,
    readonly host: string,
    readonly pollState: boolean,
    readonly evalState: boolean,
    readonly created: Date,
    readonly register: Register,
    readonly evaluationScoreboard: EvaluationScoreboard,
    readonly scoreboard: Scoreboard
  ) {}

  static createEmpty(id: string, uid: string, displayName: string): Game {
    const reg: Register = Register.init(uid, displayName);
    const sco: EvaluationScoreboard = EvaluationScoreboard.init();
    const board = Scoreboard.init();
    return new Game(
      id,
      null,
      null,
      null,
      0,
      0,
      uid,
      false,
      false,
      new Date(),
      reg,
      sco,
      board
    );
  }
}
