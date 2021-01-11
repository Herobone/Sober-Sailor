import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

import { kickPlayerHandler } from "./https/KickPlayer";
import { closeGameHandler } from "./https/CloseGame";
// import { garbageCollectionHTTPSHandler } from "./https/GarbageCollection";
// import { garbageCollectionHandler } from "./timed/GarbageCollection";
import { onPlayerLeaveHandler } from "./firestore/OnPlayerLeave";
import { onPlayerJoinHandler } from "./firestore/OnPlayerJoin";
import { singleTargetHandler } from "./https/SingleTarget";

export const singleTarget = functions
  .region("europe-west1")
  .https.onCall(singleTargetHandler);

export const onPlayerJoin = functions
  .region("europe-west1")
  .firestore.document("/{gameID}/general/players/{playerID}")
  .onCreate(onPlayerJoinHandler);

export const onPlayerLeave = functions
  .region("europe-west1")
  .firestore.document("/{gameID}/general/players/{playerID}")
  .onDelete(onPlayerLeaveHandler);

// export const garbageCollection = functions
//   .region("europe-west1")
//   .pubsub.schedule("every 12 hours")
//   .onRun(garbageCollectionHandler);
//
// export const garbageCollectionHTTPS = functions
//   .region("europe-west1")
//   .https.onRequest(garbageCollectionHTTPSHandler);

export const closeGame = functions
  .region("europe-west1")
  .https.onCall(closeGameHandler);

export const kickPlayer = functions
  .region("europe-west1")
  .https.onCall(kickPlayerHandler);
