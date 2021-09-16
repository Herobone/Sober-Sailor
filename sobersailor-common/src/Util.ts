export default class Util {
  /**
   * Convert a Map to a JSON-style object.
   *
   * **IMPORTANT:** The index of the map must be a string
   * @param map The map to be converted
   */
  static mapToObj<T>(map: Map<string, T>): { [key: string]: T } {
    const obj = Object.create(null);
    for (const [k, v] of map) {
      // We don’t escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
  }

  /**
   * Convert a JSON-style object map top a JavaScript Map
   * @param obj The object that will be converted to a map
   */
  static objToMap<T>(obj: { [key: string]: T }): Map<string, T> {
    const strMap: Map<string, T> = new Map();
    for (const k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  }

  static random(from: number, to: number): number {
    return Math.floor(Math.random() * to + from);
  }

  static randomCharOrNumber(): string {
    const num = this.random(0, 35);
    return this.charOrNumber(num);
  }

  static charOrNumber(num: number): string {
    return num < 26 ? String.fromCharCode(65 + num) : String(num - 26);
  }

  static randomCharOrNumberSequence(len: number): string {
    let sequence = "";

    for (let index = 0; index < len; index++) {
      sequence += this.randomCharOrNumber();
    }

    return sequence;
  }

  static getRandomKey<T>(collection: Map<T, unknown>): T {
    const keys = [...collection.keys()];
    return keys[Math.floor(Math.random() * keys.length)];
  }

  static getRandomItem<K, V>(set: Map<K, V>): [K, V] {
    const items = [...set];
    return items[Math.floor(Math.random() * items.length)];
  }

  static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  static alphanumeric(text: string): RegExpMatchArray | null {
    const letters = /^[\da-z]+$/gi;
    return text.match(letters);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static hasKey<O>(obj: O, key: keyof any): key is keyof O {
    return key in obj;
  }

  static selectRandom<T>(obj: Array<T>): T {
    return obj[Util.random(0, obj.length)];
  }

  static getDateIn(years = 0, months = 0, days = 0): Date {
    const d = new Date();
    return new Date(
      d.getFullYear() + years,
      d.getMonth() + months,
      d.getDate() + days
    );
  }

  static countOccurrences<T>(array: T[]): Map<T, number> {
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
  }
}
