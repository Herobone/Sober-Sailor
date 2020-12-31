import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { SingleTargetRequest, SingleTargetResult } from "./models/SingleTarget";
import { gameConverter } from "./models/Game";
import { Player } from "./models/Player";
import { KickPlayer } from "./models/HostEvents";

admin.initializeApp();

import FirestoreUtil from "./helper/FirestoreUtil";

const db = admin.firestore();

export const singleTarget = functions.region("europe-west1").https.onCall(
  async (data: SingleTargetRequest, context): Promise<SingleTargetResult> => {
    const auth = context.auth;
    if (auth) {
      const requestUID = auth.uid;

      const gameData = await FirestoreUtil.getGameData(data.gameID);
      if (!gameData) {
        throw new functions.https.HttpsError(
          "not-found",
          "Game data was missing!"
        );
      }
      if (requestUID !== gameData.taskTarget) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Function must be called by target of the question!"
        );
      }

      const playerData = await FirestoreUtil.getPlayerData(
        data.gameID,
        requestUID
      );
      if (!playerData) {
        throw new functions.https.HttpsError(
          "not-found",
          "Player data was missing!"
        );
      }

      await FirestoreUtil.getGame(data.gameID).update({
        evalState: true,
      });

      await FirestoreUtil.getPlayer(data.gameID, requestUID).set(
        new Player(
          playerData.uid,
          playerData.nickname,
          data.answer ? playerData.sips : playerData.sips + gameData.penalty,
          null
        )
      );

      return { status: "All okay", responseOK: true };
    } else {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User was not authenticated with firebase while calling this function!"
      );
    }
  }
);

export const onPlayerJoin = functions
  .region("europe-west1")
  .firestore.document("/games/{gameID}/players/{playerID}")
  .onCreate(async (snapshot, context) => {
    if (context.params.playerID === "register") {
      // If the created document was a register don't proceed!
      throw new functions.https.HttpsError(
        "ok",
        "Function triggered on register create"
      );
    }

    const registerRef = await FirestoreUtil.getRegisterRef(
      context.params.gameID
    );
    const playerData = snapshot.data();

    let playerUid: Map<string, string> = new Map();

    if (registerRef.exists) {
      playerUid = FirestoreUtil.createMap(registerRef);
    }

    playerUid.set(context.params.playerID, playerData.nickname);

    await FirestoreUtil.updateRegister(context.params.gameID, playerUid);

    return null;
  });

export const onPlayerLeave = functions
  .region("europe-west1")
  .firestore.document("/games/{gameID}/players/{playerID}")
  .onDelete(async (snapshot, context) => {
    if (context.authType === "ADMIN") {
      // If the delete was performed by an ADMIN (console or firebase) ignore it
      throw new functions.https.HttpsError("ok", "Delete by admin is ignored!");
    }

    const registerRef = await FirestoreUtil.getRegisterRef(
      context.params.gameID
    );

    const map = FirestoreUtil.createMap(registerRef);
    map.delete(context.params.playerID);

    await FirestoreUtil.updateRegister(context.params.gameID, map);

    return null;
  });

export const garbageCollection = functions
  .region("europe-west1")
  .pubsub.schedule("every 12 hours")
  .onRun(async () => {
    const maxAge = Date.now() - 12 * 60 * 60 * 1000;
    const gamesRef = await db
      .collection("games")
      .where("created", "<", new Date(maxAge))
      .withConverter(gameConverter)
      .get();
    await gamesRef.forEach(async (gameToDelete) => {
      const players = await FirestoreUtil.getPlayers(gameToDelete.id).get();
      await players.forEach(async (playerToDelete) => {
        console.log("Player, ", playerToDelete.id);
        await playerToDelete.ref.delete();
      });

      await gameToDelete.ref.delete();
    });
  });

export const garbageCollectionHTTPS = functions
  .region("europe-west1")
  .https.onRequest(async (req, resp) => {
    const maxAge = Date.now() - 12 * 60 * 60 * 1000;
    const gamesRef = await db
      .collection("games")
      .where("created", "<", new Date(maxAge))
      .withConverter(gameConverter)
      .get();
    const results: string[] = [];
    await gamesRef.forEach(async (gameToDelete) => {
      results.push(gameToDelete.id);

      const players = await FirestoreUtil.getPlayers(gameToDelete.id).get();
      await players.forEach(async (playerToDelete) => {
        console.log("Player, ", playerToDelete.id);
        await playerToDelete.ref.delete();
      });

      await gameToDelete.ref.delete();
    });
    resp.json(results);
  });

export const closeGame = functions
  .region("europe-west1")
  .https.onCall(async (data: { gameID: string }, context) => {
    const auth = context.auth;
    if (auth) {
      const requestUID = auth.uid;
      const gameData = await FirestoreUtil.getGameData(data.gameID);

      if (!gameData) {
        throw new functions.https.HttpsError(
          "not-found",
          "Game data was missing!"
        );
      }
      if (requestUID !== gameData.host) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Function must be called by host of game!"
        );
      }
      const gameRef = FirestoreUtil.getGame(data.gameID);

      const players = await FirestoreUtil.getPlayers(data.gameID).get();
      await players.forEach(async (playerToDelete) => {
        console.log("Player, ", playerToDelete.id);
        await playerToDelete.ref.delete();
      });

      await gameRef.delete();
    } else {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User was not authenticated with firebase while calling this function!"
      );
    }
  });

export const kickPlayer = functions
  .region("europe-west1")
  .https.onCall(async (data: KickPlayer, context) => {
    const auth = context.auth;
    if (auth) {
      const requestUID = auth.uid;
      const gameData = await FirestoreUtil.getGameData(data.gameID);

      if (!gameData) {
        throw new functions.https.HttpsError(
          "not-found",
          "Game data was missing!"
        );
      }
      if (requestUID !== gameData.host) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Function must be called by host of game!"
        );
      }

      await FirestoreUtil.getPlayer(data.gameID, data.playerID).delete();

      const registerRef = await FirestoreUtil.getRegisterRef(data.gameID);
      const map = FirestoreUtil.createMap(registerRef);

      map.delete(data.playerID);

      await FirestoreUtil.updateRegister(data.gameID, map);
    } else {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User was not authenticated with firebase while calling this function!"
      );
    }
  });
