import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// This has to be here before all the other imports
admin.initializeApp();

import { singleTargetHandler } from "./https/SingleTarget";
import { kickPlayerHandler } from "./https/KickPlayer";
import { closeGameHandler } from "./https/CloseGame";
import { onPlayerLeaveHandler } from "./firestore/OnPlayerLeave";
import { onPlayerJoinHandler } from "./firestore/OnPlayerJoin";
import { garbageCollectionHandler } from "./timed/GarbageCollection";
import { garbageCollectionHTTPSHandler } from "./https/GarbageCollection";
import { evaluateGameHandler } from "./https/Evaluate";
import { updateScoreboardHandler } from "./https/UpdateScoreboard";
import {
  updateTaskInfoHandler,
  updateTaskInfoHTTPSHandler,
} from "./timed/UpdateTaskInfo";
import { nextTaskHandler } from "./https/NextTask";

exports.singleTarget = functions
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

export const updateTaskInfo = functions
  .region("europe-west1")
  .pubsub.schedule("every 24 hours")
  .onRun(updateTaskInfoHandler);

export const updateTaskInfoHTTPS = functions
  .region("europe-west1")
  .https.onRequest(updateTaskInfoHTTPSHandler);

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

export const nextTask = functions
  .region("europe-west1")
  .https.onCall(nextTaskHandler);
