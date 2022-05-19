/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2020-2022.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

import React, { forwardRef, ReactElement, useImperativeHandle, useState } from "react";
import { Register } from "sobersailor-common/lib/models/Register";
import { Alerts } from "../../helper/AlertTypes";
import { GameManager } from "../../helper/gameManager";
import { useAlert } from "../Functional/AlertProvider";
import { Serverless } from "../../helper/Serverless";

interface KickPlayer {
    gameID: string;
    playerID: string;
}

type KickListHandles = {
    show: (shown?: boolean) => void;
};

const KickListIntern = forwardRef<KickListHandles>((props, ref): JSX.Element => {
    const { createAlert } = useAlert();
    const [shown, setShown] = useState(false);

    const show = (showList?: boolean): void => {
        if (showList === undefined) {
            setShown(true);
        } else {
            setShown(showList);
        }
    };

    useImperativeHandle(ref, () => ({
        show,
    }));

    if (shown) {
        const pltRaw = localStorage.getItem("playerLookupTable");
        const vals: ReactElement[] = [];
        let register: Register;
        if (pltRaw) {
            register = Register.parse(pltRaw);
            register.playerUidMap.forEach((username: string, uid: string) => {
                vals.push(
                    <li
                        // eslint-disable-next-line react/no-array-index-key
                        key={`kick${uid}`}
                        className="w3-bar-item w3-button"
                    >
                        <button
                            type="submit"
                            onClick={() => {
                                const callData: KickPlayer = {
                                    gameID: GameManager.getGameID(),
                                    playerID: uid,
                                };
                                Serverless.callFunction(Serverless.KICK_PLAYER)(callData)
                                    .then(() => setShown(false))
                                    .catch(console.warn);
                            }}
                        >
                            {username}
                        </button>
                    </li>,
                );
            });
        } else {
            createAlert(Alerts.ERROR, "LocalStorage had no PLT stored!");
        }

        return <ul className="w3-block w3-black w3-bar-block w3-border">{vals}</ul>;
    }
    return <></>;
});
KickListIntern.displayName = "KickList";

export const KickList = KickListIntern;
