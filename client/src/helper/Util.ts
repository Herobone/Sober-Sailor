// This class contains static Methods that might come useful for like anything
class Util {
    static random(from: number, to: number): number {
        return Math.floor((Math.random() * to) + from);
    }

    static randomCharOrNumber(): string {
        const num = this.random(0, 35);
        return this.charOrNumber(num);
    }

    static charOrNumber(num: number): string {
        let str: string;
        if (num < 26) {
            str = String.fromCharCode(65 + num);
        } else {
            str = String(num - 26);
        }
        return str;
    }

    static randomCharOrNumberSequence(len: number): string {
        let sequ = "";

        for (let index = 0; index < len; index++) {
            sequ += this.randomCharOrNumber();

        }

        return sequ;
    }

    static getRandomKey<T>(collection: Map<T, any>): T {
        const keys = Array.from(collection.keys());
        return keys[Math.floor(Math.random() * keys.length)];
    }

    static getRandomItem<K, V>(set: Map<K, V>) {
        const items = Array.from(set);
        return items[Math.floor(Math.random() * items.length)];
    }

    static getRandomElement<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    static alphanumeric(text: string) {
        const letters = /^[0-9a-zA-Z]+$/ig;
        return text.match(letters);
    }

    static hasKey<O>(obj: O, key: keyof any): key is keyof O {
        return key in obj;
    }

    static selectRandom<T>(obj: Array<T>): T {
        return obj[Util.random(0, obj.length)];
    }

    static countOccurences<T>(array: T[]): Map<T, number> {
        let content: T[] = [],
            count: number[] = [],
            prev;

        const countMap: Map<T, number> = new Map<T, number>();

        array.sort();
        for (var i = 0; i < array.length; i++) {
            if (array[i] !== prev) {
                content.push(array[i]);
                count.push(1);
            } else {
                count[count.length - 1]++;
            }
            prev = array[i];
        }

        for (let i = 0; i < content.length; i++) {
            countMap.set(content[i], count[i]);
        }

        return countMap;
    }

    static strMapToObj(strMap: Map<string, string>): { [key: string]: string } {
        const obj = Object.create(null);
        for (const [k, v] of strMap) {
            // We don’t escape the key '__proto__'
            // which can cause problems on older engines
            obj[k] = v;
        }
        return obj;
    }

    static objToStrMap(obj: { [key: string]: string }): Map<string, string> {
        const strMap: Map<string, string> = new Map();
        for (const k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }
}

export default Util