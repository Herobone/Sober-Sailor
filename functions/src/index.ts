import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

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
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
}

function objToStrMap(obj : { [key: string]: string }): Map<string,string> {
    let strMap: Map<string,string> = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}

export const onPlayerJoin = functions.firestore.document("/games/{gameID}/players/{playerID}").onCreate(async (snapshot, context) => {

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
    const players: string[] = [];
    playerUid.forEach((value: string) => {
        players.push(value);
    })
    playerColRef.doc("register").set({
        players: players,
        playerUidMap: strMapToObj(playerUid)
    });
})
