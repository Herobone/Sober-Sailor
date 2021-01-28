import * as admin from "firebase-admin";
import Util from "../helper/Util";

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

export interface DescribeInOneWordRequest {
  answer: string;
  gameID: string;
}

export interface DescribeInOneWordResult {
  writeOK: boolean;
}

export interface IDescribeInOneWord {
  word: string;
  answers: Map<string, string>;
  initialPlayerCount: number;
}

export interface IDescribeInOneWordExternal {
  word: string;
  answers: { [player: string]: string };
  initialPlayerCount: number;
}

export class DescribeInOneWord implements IDescribeInOneWord {
  constructor(
    readonly word: string,
    readonly answers: Map<string, string>,
    readonly initialPlayerCount: number
  ) {}
}

export const diowConverter = {
  toFirestore(game: IDescribeInOneWord): admin.firestore.DocumentData {
    return {
      word: game.word,
      answers: Util.strMapToObj(game.answers),
      playerCount: game.initialPlayerCount,
    };
  },
  fromFirestore(
    snapshot: admin.firestore.QueryDocumentSnapshot<IDescribeInOneWordExternal>
  ): DescribeInOneWord {
    const data = snapshot.data();
    return new DescribeInOneWord(
      data.word,
      Util.objToStrMap(data.answers),
      data.initialPlayerCount
    );
  },
};
