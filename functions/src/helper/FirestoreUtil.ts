/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2022.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

import { playerConverter } from "../models/Player";
import * as admin from "firebase-admin";
import { gameConverter } from "../models/Game";
import Util from "sobersailor-common/lib/Util";
import { Game } from "sobersailor-common/lib/models/Game";
import { Player } from "sobersailor-common/lib/models/Player";
import { taskConfigConverter } from "../models/TaskConfig";
import { TaskConfig } from "sobersailor-common/lib/models/TaskConfig";

export default class FirestoreUtil {
  static fs: admin.firestore.Firestore = admin.firestore();

  static async getPlayerData(gameID: string, playerID: string) {
    const playerDocRef = FirestoreUtil.getPlayer(gameID, playerID);
    const playerRef = await playerDocRef.get();
    return playerRef.data();
  }

  static createMap(
    registerRef: admin.firestore.DocumentSnapshot
  ): Map<string, string> {
    const playerUid: Map<string, string> = new Map();

    const data = registerRef.data();
    if (data) {
      Util.objToMap<string>(data.playerUidMap).forEach(
        (value: string, key: string) => {
          playerUid.set(key, value);
        }
      );
    }

    return playerUid;
  }

  static async updateRegister(gameID: string, game: Game) {
    await FirestoreUtil.getGame(gameID).update({
      playerUidMap: game.register.serialize(),
    });
  }

  static getGame(gameID: string): admin.firestore.DocumentReference {
    return FirestoreUtil.fs.collection("games").doc(gameID);
  }

  static async getGameData(gameID: string) {
    const gameDocRef = FirestoreUtil.getGame(gameID);
    const gameRef = await gameDocRef.withConverter(gameConverter).get();
    return gameRef.data();
  }

  static getPlayers(gameID: string) {
    return FirestoreUtil.getGame(gameID).collection("players");
  }

  static async getAllPlayers(gameID: string): Promise<Player[]> {
    const players: Player[] = [];
    const playerRef =
      FirestoreUtil.getPlayers(gameID).withConverter(playerConverter);
    const queryIn = await playerRef.get();
    queryIn.forEach((docIn) => {
      const data = docIn.data();
      if (data) {
        players.push(data);
      }
    });
    return players;
  }

  static getPlayer(gameID: string, playerID: string) {
    return FirestoreUtil.getPlayers(gameID)
      .doc(playerID)
      .withConverter(playerConverter);
  }

  static getTaskConfigDoc() {
    return this.fs
      .collection("config")
      .doc("tasks")
      .withConverter(taskConfigConverter);
  }

  static async getTaskConfig(): Promise<TaskConfig | undefined> {
    const data = await FirestoreUtil.getTaskConfigDoc().get();
    return data.data();
  }
}
