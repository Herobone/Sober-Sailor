/** ***************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export interface IPlayer {
    uid: string;
    nickname: string;
    sips: number;
    answer: string | null;
}

interface IPlayerExternal {
    nickname: string;
    sips: number;
    answer: string | null;
}

export class Player implements IPlayer {
    constructor(
        readonly uid: string,
        readonly nickname: string,
        readonly sips: number,
        readonly answer: string | null,
    ) {}
}

export const playerConverter = {
    toFirestore(player: Player): firebase.firestore.DocumentData {
        return {
            nickname: player.nickname,
            sips: player.sips,
            answer: player.answer,
        };
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot<IPlayerExternal>,
        options: firebase.firestore.SnapshotOptions,
    ): Player {
        const data = snapshot.data(options);
        return new Player(snapshot.id, data.nickname, data.sips, data.answer);
    },
};
