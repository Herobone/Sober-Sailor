// This class contains static Methods that might come useful for like anything
class Util {
  static random(from: number, to: number): number {
    return Math.floor(Math.random() * to + from);
  }

  static randomCharOrNumber(): string {
    const num = this.random(0, 35);
    return this.charOrNumber(num);
  }

  static charOrNumber(num: number): string {
    const str: string = num < 26 ? String.fromCharCode(65 + num) : String(num - 26);
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
    const keys = [...collection.keys()];
    return keys[Math.floor(Math.random() * keys.length)];
  }

  static getRandomItem<K, V>(set: Map<K, V>) {
    const items = [...set];
    return items[Math.floor(Math.random() * items.length)];
  }

  static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  static alphanumeric(text: string) {
    const letters = /^[\da-z]+$/gi;
    return text.match(letters);
  }

  static hasKey<O>(obj: O, key: keyof any): key is keyof O {
    return key in obj;
  }

  static selectRandom<T>(obj: Array<T>): T {
    return obj[Util.random(0, obj.length)];
  }

  static countOccurences<T>(array: T[]): Map<T, number> {
    const content: T[] = [];
    const count: number[] = [];
    let prev;

    const countMap: Map<T, number> = new Map<T, number>();

    array.sort();
    for (const element of array) {
      if (element !== prev) {
        content.push(element);
        count.push(1);
      } else {
        count[count.length - 1]++;
      }
      prev = element;
    }

    for (const [i, element] of content.entries()) {
      countMap.set(element, count[i]);
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

export default Util;
