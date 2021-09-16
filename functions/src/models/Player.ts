/*****************************
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

import * as admin from "firebase-admin";
import {
  IPlayerExternal,
  Player,
} from "@herobone/sobersailor-common/lib/models/Player";

export const playerConverter: admin.firestore.FirestoreDataConverter<Player> = {
  toFirestore(player: Player): admin.firestore.DocumentData {
    return {
      nickname: player.nickname,
      sips: player.sips,
      answer: player.answer,
    };
  },
  fromFirestore(
    snapshot: admin.firestore.QueryDocumentSnapshot<IPlayerExternal>
  ): Player {
    const data = snapshot.data();
    return new Player(snapshot.id, data.nickname, data.sips, data.answer);
  },
};
