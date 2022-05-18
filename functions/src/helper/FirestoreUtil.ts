import { playerConverter } from "../models/Player";
import * as admin from "firebase-admin";
import { gameConverter } from "../models/Game";
import Util from "sobersailor-common/lib/Util";
import { Game } from "sobersailor-common/lib/models/Game";
import { Player } from "sobersailor-common/lib/models/Player";
import { taskConfigConverter } from "../models/TaskConfig";
import { TaskConfig } from "sobersailor-common/lib/models/TaskConfig";

export default class FirestoreUtil {
  static db: admin.firestore.Firestore = admin.firestore();

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
    return FirestoreUtil.db.collection("games").doc(gameID);
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
    return this.db
      .collection("config")
      .doc("tasks")
      .withConverter(taskConfigConverter);
  }

  static async getTaskConfig(): Promise<TaskConfig | undefined> {
    const data = await FirestoreUtil.getTaskConfigDoc().get();
    return data.data();
  }
}
