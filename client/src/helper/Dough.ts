import Cookies from "universal-cookie";
import { getPerformance } from "firebase/performance";
import { getAnalytics } from "firebase/analytics";
import Util from "sobersailor-common/lib/Util";
import { firebaseApp } from "./config";

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
type CookieTypes = "analytics" | "marketing";

export class Dough {
    private static cookies = new Cookies();

    public static checkCookies(type: CookieTypes): boolean {
        const allowString = this.cookies.get("cookies_allowed");
        if (allowString) {
            return allowString.includes(type);
        }
        return false;
    }

    /**
     * Start Analysis if cookie is present
     */
    public static startAnalytics(): void {
        if (this.checkCookies("analytics") && process.env.NODE_ENV === "production") {
            getAnalytics(firebaseApp);
            getPerformance(firebaseApp);
            console.log("Analytics activated");
        }
    }

    public static isDoughPresent(): boolean {
        return this.cookies.get("cookies_allowed") !== undefined;
    }

    public static makeDough(types: CookieTypes[]): void {
        this.cookies.set("cookies_allowed", JSON.stringify(types), {
            expires: Util.getDateIn(1),
            sameSite: "strict",
        });
    }
}
