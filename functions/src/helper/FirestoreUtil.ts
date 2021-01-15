import { playerConverter } from "../models/Player";
import * as admin from "firebase-admin";
import { gameConverter } from "../models/Game";
import Util from "./Util";

export default class FirestoreUtil {
  static db = admin.firestore();

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
      Util.objToStrMap(data.playerUidMap).forEach(
        (value: string, key: string) => {
          playerUid.set(key, value);
        }
      );
    }

    return playerUid;
  }

  static async updateRegister(gameID: string, playerMap: Map<string, string>) {
    if (playerMap.size > 0) {
      await FirestoreUtil.getRegister(gameID).set({
        playerUidMap: Util.strMapToObj(playerMap),
      });
    }
  }

  static getRegister(gameID: string) {
    return FirestoreUtil.getGame(gameID).doc("register");
  }

  static getRegisterRef(gameID: string) {
    return FirestoreUtil.getRegister(gameID).get();
  }

  static getGame(gameID: string) {
    return FirestoreUtil.db.collection(gameID);
  }

  static getGameDoc(gameID: string) {
    return FirestoreUtil.getGame(gameID).doc("general");
  }

  static async getGameData(gameID: string) {
    const gameDocRef = FirestoreUtil.getGameDoc(gameID);
    const gameRef = await gameDocRef.withConverter(gameConverter).get();
    return gameRef.data();
  }

  static getPlayers(gameID: string) {
    return FirestoreUtil.getGameDoc(gameID).collection("players");
  }

  static getPlayer(gameID: string, playerID: string) {
    return FirestoreUtil.getPlayers(gameID)
      .doc(playerID)
      .withConverter(playerConverter);
  }
}
