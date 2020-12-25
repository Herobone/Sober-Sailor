import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import { SingleTargetRequest, SingleTargetResult } from './models/SingleTarget';
import { gameConverter } from './models/Game';
import { Player, playerConverter } from './models/Player';

admin.initializeApp();

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//    functions.logger.info("Hello logs!", { structuredData: true });
//    response.send("Hello from Firebase!");
//});

function strMapToObj(strMap: Map<string, string>): { [key: string]: string } {
    const obj = Object.create(null);
    for (const [k, v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
}

function objToStrMap(obj: { [key: string]: string }): Map<string, string> {
    const strMap: Map<string, string> = new Map();
    for (const k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}

export const singleTarget = functions.region("europe-west1").https.onCall(async (data: SingleTargetRequest, context): Promise<SingleTargetResult> => {
    const auth = context.auth;
    console.log(data);
    if (auth) {
        const requestUID = auth.uid;
        const gameDocRef = admin.firestore().collection("games").doc(data.gameID);
        const gameRef = await gameDocRef.withConverter(gameConverter).get();
        const gameData = gameRef.data();
        if (!gameData) {
            return { status: "Data missing", responseOK: false };
        }
        if (requestUID !== gameData.taskTarget) {
            return { status: "Not called by target of task", responseOK: false };
        }
        const playerRef = gameDocRef.collection("players").doc(requestUID).withConverter(playerConverter);
        const playerData = (await playerRef.get()).data();

        if (!playerData) {
            return { status: "Data missing", responseOK: false };
        }

        await gameDocRef.update({
            evalState: true,
        });

        await playerRef.set(new Player(playerData.uid,
            playerData.nickname,
            data.answer ? playerData.sips : playerData.sips + gameData.penalty,
            null));

        return { status: "All okay", responseOK: true }
    } else {
        return { status: "Not authenticated", responseOK: false };
    }
});

export const onPlayerJoin = functions.region("europe-west1").firestore.document("/games/{gameID}/players/{playerID}").onCreate(async (snapshot, context) => {

    if (context.params.playerID === "register") {
        return null;
    }

    const playerColRef = db.collection("games").doc(context.params.gameID).collection("players");
    const registerRef = await playerColRef.doc("register").get();
    const playerData = snapshot.data();

    const playerUid: Map<string, string> = new Map();

    playerUid.set(context.params.playerID, playerData.nickname);
    if (registerRef.exists) {
        const data = registerRef.data();
        if (data) {
            objToStrMap(data.playerUidMap).forEach((value: string, key: string) => {
                playerUid.set(key, value);
            });
        }
    }
    await playerColRef.doc("register").set({
        playerUidMap: strMapToObj(playerUid),
    });
    return null;
});

export const onPlayerLeave = functions.region("europe-west1").firestore.document("/games/{gameID}/players/{playerID}").onDelete(async (snapshot, context) => {

    const playerColRef = db.collection("games").doc(context.params.gameID).collection("players");
    const registerRef = await playerColRef.doc("register").get();

    const playerUid: Map<string, string> = new Map();

    const data = registerRef.data();
    if (data) {
        objToStrMap(data.playerUidMap).forEach((value: string, key: string) => {
            playerUid.set(key, value);
        });
    }

    playerUid.delete(context.params.playerID);
    await playerColRef.doc("register").set({
        playerUidMap: strMapToObj(playerUid),
    });
    return null;
});