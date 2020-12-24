import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

export const test = functions.https.onRequest(async (request, response) => {
    const result = await db.collection("testcol").add({
        test: "data"
    });
    response.json({result: `Message with ID: ${result.id} added.`});
});

export const onPlayerJoin = functions.firestore.document("/games/{gameID}/players/{playerID}").onCreate(async (snapshot, context) => {
    const registerRef = await db.collection("games").doc(context.params.gameID).collection("players").doc("register").get();
    if (registerRef.exists) {
        const data = registerRef.data();
        
    }
})
