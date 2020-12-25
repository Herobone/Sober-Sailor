import firebase from "firebase";

interface IRegister {
    players: string[];
    playerUidMap: Map<string, string>;
}

class Register implements IRegister {
    constructor (
        readonly players: string[],
        readonly playerUidMap: Map<string, string>
    ) {}
}
/*
export const registerConverter = {
    toFirestore(register: Register): firebase.firestore.DocumentData {
        return {
            players: register.players
        }
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot<IRegister>,
        options: firebase.firestore.SnapshotOptions
    ): Register {
        const data = snapshot.data(options);
        return new Register(
            snapshot.id,
            data.currentTask,
            data.type,
            data.taskTarget,
            data.round,
            data.host,
            data.pollState,
            data.evalState,
            data.created.toDate()
        );
    }
}*/