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

import React, { ReactElement, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button, ButtonGroup } from "@material-ui/core";
import { GameManager } from "../helper/gameManager";
import { useAlert } from "../Components/Functional/AlertProvider";
import { Alerts } from "../helper/AlertTypes";
import { useTask } from "../state/actions/taskActions";
import { usePollState } from "../state/actions/displayStateActions";

export function WhoWouldRather(): JSX.Element {
    const [inputLock, setInputLock] = useState(true);
    const [answer, setAnswer] = useState<string | null>(null);
    const { createAlert } = useAlert();

    const question = useTask()[0];
    const pollState = usePollState()[0];
    if (!question) {
        return <></>;
    }

    useEffect(() => {
        setInputLock(true);
        setAnswer(null);
        console.log("Resetting WWR");
    }, [question]);

    useEffect(() => {
        setInputLock(!pollState);
    }, [pollState]);

    const plt = GameManager.getPlayerLookupTable();
    if (!plt) {
        createAlert(Alerts.WARNING, "No PLT stored! Reload Page!");
        return <div>ERROR</div>;
    }

    const values: ReactElement[] = [];
    plt.playerUidMap.forEach((nickname: string, uid: string) => {
        values.push(
            // eslint-disable-next-line react/no-array-index-key
            <ButtonGroup key={uid} orientation="vertical" color="primary" variant="contained">
                <Button
                    className="wwr-player-select"
                    type="submit"
                    onClick={() => {
                        GameManager.setAnswer(uid).catch(console.error);
                        setAnswer(nickname);
                        setInputLock(true);
                    }}
                >
                    {nickname}
                </Button>
            </ButtonGroup>,
        );
    });

    return (
        <div>
            <h2>
                <FormattedMessage id="gamemodes.whowouldrather" /> {question}
            </h2>
            <p>
                <FormattedMessage id="gamemodes.whowouldrather.description" />
            </p>
            {!inputLock && !answer && values}
            {answer && (
                <div>
                    <FormattedMessage
                        id="elements.result.youranswer"
                        values={{
                            answer,
                        }}
                    />
                </div>
            )}
        </div>
    );
}
