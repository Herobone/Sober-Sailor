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
// This class contains static Methods that might come useful for like anything
export const Util = {
    random(from: number, to: number): number {
        return Math.floor(Math.random() * to + from);
    },

    randomCharOrNumber(): string {
        const num = this.random(0, 35);
        return this.charOrNumber(num);
    },

    charOrNumber(num: number): string {
        return num < 26 ? String.fromCharCode(65 + num) : String(num - 26);
    },

    randomCharOrNumberSequence(len: number): string {
        let sequence = "";

        for (let index = 0; index < len; index++) {
            sequence += this.randomCharOrNumber();
        }

        return sequence;
    },

    getRandomKey<T>(collection: Map<T, unknown>): T {
        const keys = [...collection.keys()];
        return keys[Math.floor(Math.random() * keys.length)];
    },

    getRandomItem<K, V>(set: Map<K, V>): [K, V] {
        const items = [...set];
        return items[Math.floor(Math.random() * items.length)];
    },

    getRandomElement<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    },

    alphanumeric(text: string): RegExpMatchArray | null {
        const letters = /^[\da-z]+$/gi;
        return text.match(letters);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasKey<O>(obj: O, key: keyof any): key is keyof O {
        return key in obj;
    },

    selectRandom<T>(obj: Array<T>): T {
        return obj[Util.random(0, obj.length)];
    },

    getDateIn(years = 0, months = 0, days = 0): Date {
        const d = new Date();
        return new Date(d.getFullYear() + years, d.getMonth() + months, d.getDate() + days);
    },

    countOccurences<T>(array: T[]): Map<T, number> {
        const content: T[] = [];
        const count: number[] = [];
        let prev: T;

        const countMap: Map<T, number> = new Map<T, number>();

        array.sort();
        array.forEach((element) => {
            if (element !== prev) {
                content.push(element);
                count.push(1);
            } else {
                count[count.length - 1]++;
            }
            prev = element;
        });

        content.forEach((element, i) => {
            countMap.set(element, count[i]);
        });

        return countMap;
    },

    strMapToObj(strMap: Map<string, string>): { [key: string]: string } {
        const obj = Object.create(null);
        strMap.forEach((v: string, k: string) => {
            // We don’t escape the key '__proto__'
            // which can cause problems on older engines
            obj[k] = v;
        });
        return obj;
    },

    objToStrMap(obj: { [key: string]: string }): Map<string, string> {
        const strMap: Map<string, string> = new Map();
        Object.keys(obj).forEach((key: string) => {
            strMap.set(key, obj[key]);
        });
        return strMap;
    },
};
