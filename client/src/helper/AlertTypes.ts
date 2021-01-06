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

/* eslint-disable max-classes-per-file */
import { ReactElement } from "react";

export interface Alert {
    defaultHeader: string;
    color: string;
}

export class Warning implements Alert {
    defaultHeader = "elements.alerts.warning";

    color = "w3-yellow";
}

export class Success implements Alert {
    defaultHeader = "elements.alerts.success";

    color = "w3-green";
}

export class Info implements Alert {
    defaultHeader = "elements.alerts.info";

    color = "w3-blue";
}

export class Error implements Alert {
    defaultHeader = "elements.alerts.error";

    color = "w3-red";
}

export type AlertCreator = (type: Alert, message: string | ReactElement, header?: ReactElement) => void;

export class Alerts {
    static WARNING: Warning = new Warning();

    // This overwrites the standard Error class. Use only in this file!
    // eslint-disable-next-line unicorn/error-message
    static ERROR: Error = new Error();

    static INFO: Info = new Info();

    static SUCCESS: Success = new Success();
}
/* eslint-enable max-classes-per-file */
