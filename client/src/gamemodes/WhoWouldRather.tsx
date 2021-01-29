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

import React, { forwardRef, PropsWithChildren, ReactElement, useEffect, useImperativeHandle, useState } from "react";
import { FormattedMessage } from "react-intl";
import { GameManager } from "../helper/gameManager";
import { Player } from "../helper/models/Player";

interface Props {
    question: string;
}

type WhoWouldRatherHandles = {
    lockInput: (lock: boolean) => void;
};

export const WhoWouldRather = forwardRef<WhoWouldRatherHandles, Props>(
    (props: PropsWithChildren<Props>, ref): JSX.Element => {
        const [inputLock, setInputLock] = useState(true);
        const [players, setPlayers] = useState<Player[]>([]);
        const [answer, setAnswer] = useState<string | null>(null);

        useEffect(() => {
            GameManager.getAllPlayers().then(setPlayers).catch(console.error);
        }, []);

        const lockInput = (lock: boolean): void => {
            setInputLock(lock);
        };

        useImperativeHandle(ref, () => ({
            lockInput,
        }));

        const values: ReactElement[] = [];
        players.forEach((element: Player) => {
            values.push(
                <div key={element.uid}>
                    <button
                        className="wwr-player-select"
                        type="submit"
                        onClick={() => {
                            GameManager.setAnswer(element.uid).catch(console.error);
                            setAnswer(element.nickname);
                            setInputLock(true);
                        }}
                    >
                        {element.nickname}
                    </button>
                    <br />
                </div>,
            );
        });

        return (
            <>
                <h2>
                    <FormattedMessage id="gamemodes.whowouldrather" /> {props.question}
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
            </>
        );
    },
);
