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
import Util from "../helper/Util";

export interface IRegister {
  playerUidMap: Map<string, string>;
}

export class Register implements IRegister {
  constructor(readonly playerUidMap: Map<string, string>) {}

  serialize(): { [key: string]: string } {
    return Util.strMapToObj(this.playerUidMap);
  }

  addPlayer(uid: string, name: string): void {
    this.playerUidMap.set(uid, name);
  }

  removePlayer(uid: string): void {
    this.playerUidMap.delete(uid);
  }

  static deserialize(toDeserialize: { [key: string]: string }): Register {
    return new Register(Util.objToStrMap(toDeserialize));
  }
}
