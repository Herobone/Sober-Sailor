export default class Util {
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