export default class Util {
  static mapToObj<T>(strMap: Map<string, T>): { [key: string]: T } {
    const obj = Object.create(null);
    for (const [k, v] of strMap) {
      // We don’t escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
  }

  static objToMap<T>(obj: { [key: string]: T }): Map<string, T> {
    const strMap: Map<string, T> = new Map();
    for (const k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
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
