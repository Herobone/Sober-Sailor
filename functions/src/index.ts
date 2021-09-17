import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

import { kickPlayerHandler } from "./https/KickPlayer";
import { closeGameHandler } from "./https/CloseGame";
import { onPlayerLeaveHandler } from "./firestore/OnPlayerLeave";
import { onPlayerJoinHandler } from "./firestore/OnPlayerJoin";
import { singleTargetHandler } from "./https/SingleTarget";
import { garbageCollectionHandler } from "./timed/GarbageCollection";
import { garbageCollectionHTTPSHandler } from "./https/GarbageCollection";
import { evaluateGameHandler } from "./https/Evaluate";
import { updateScoreboardHandler } from "./https/UpdateScoreboard";

export const singleTarget = functions
  .region("europe-west1")
  .https.onCall(singleTargetHandler);

export const onPlayerJoin = functions
  .region("europe-west1")
  .firestore.document("/games/{gameID}/players/{playerID}")
  .onCreate(onPlayerJoinHandler);

export const onPlayerLeave = functions
  .region("europe-west1")
  .firestore.document("/games/{gameID}/players/{playerID}")
  .onDelete(onPlayerLeaveHandler);

export const garbageCollection = functions
  .region("europe-west1")
  .pubsub.schedule("every 12 hours")
  .onRun(garbageCollectionHandler);

export const garbageCollectionHTTPS = functions
  .region("europe-west1")
  .https.onRequest(garbageCollectionHTTPSHandler);

export const closeGame = functions
  .region("europe-west1")
  .https.onCall(closeGameHandler);

export const kickPlayer = functions
  .region("europe-west1")
  .https.onCall(kickPlayerHandler);

export const evaluateGame = functions
  .region("europe-west1")
  .https.onCall(evaluateGameHandler);

export const updateScoreboard = functions
  .region("europe-west1")
  .https.onCall(updateScoreboardHandler);
