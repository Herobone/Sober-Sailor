/** ***************************
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
import { GameManager } from "./gameManager";
import { DescribeInOneWord, diowConverter } from "./models/DescribeInOneWord";

export class DiowUtils {
    static createGame(word: string): Promise<unknown> {
        const plt = GameManager.getPlayerLookupTable();
        if (!plt) {
            throw new Error("DIOWUtils: No PLT stored!");
        }
        const emptyGame = DescribeInOneWord.constructEmptyGame(plt, word);
        return GameManager.getGameCol().doc("diow").withConverter(diowConverter).set(emptyGame);
    }
}
