import { gameConverter } from "../models/Game";
import FirestoreUtil from "../helper/FirestoreUtil";
import * as admin from "firebase-admin";

/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2021.
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

const db = admin.firestore();

export const garbageCollectionHandler = async () => {
  const maxAge = Date.now() - 12 * 60 * 60 * 1000;
  const gamesRef = await db
    .collection("games")
    .where("created", "<", new Date(maxAge))
    .withConverter(gameConverter)
    .get();
  await gamesRef.forEach(async (gameToDelete) => {
    // Delete Players
    const players = await FirestoreUtil.getPlayers(gameToDelete.id).get();
    await players.forEach(async (playerToDelete) => {
      await playerToDelete.ref.delete();
    });

    // Delete Minigames
    const minis = await gameToDelete.ref.collection("minigames").get();
    await minis.forEach(async (miniToDelete) => {
      await miniToDelete.ref.delete();
    });

    // Delete Game
    await gameToDelete.ref.delete();
  });
};
