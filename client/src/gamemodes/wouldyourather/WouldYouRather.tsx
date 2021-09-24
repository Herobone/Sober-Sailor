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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import { MultiAnswer } from "sobersailor-common/lib/models/Task";
import { useAnswers, useTask } from "../../state/actions/taskActions";
import { GameManager } from "../../helper/gameManager";
import { usePollState } from "../../state/actions/displayStateActions";
import { TranslatedMessage } from "../../translations/TranslatedMessage";

export const WouldYouRather: FunctionComponent = () => {
    const [inputLock, setInputLock] = useState(true);
    const [answer, setAnswer] = useState<string | null>(null);
    const [question] = useTask();
    const [pollState] = usePollState();
    const [answers] = useAnswers();
    const values: ReactElement[] = [];

    useEffect(() => {
        setInputLock(true);
        setAnswer(null);
        console.log("Resetting WYR");
    }, [question]);

    useEffect(() => {
        setInputLock(!pollState);
    }, [pollState]);

    if (!answers) {
        return <></>;
    }
    if (!question) {
        return <></>;
    }

    answers.forEach((multiAnswer: MultiAnswer) => {
        values.push(
            <ButtonGroup
                key={`answer-button-${multiAnswer.id}`}
                orientation="vertical"
                color="primary"
                variant="contained"
            >
                <Button
                    className="wwr-player-select"
                    type="submit"
                    onClick={() => {
                        GameManager.setAnswer(multiAnswer.id.toString(10)).catch(console.error);
                        setAnswer(multiAnswer.answer);
                        setInputLock(true);
                    }}
                >
                    {multiAnswer.answer}
                </Button>
            </ButtonGroup>,
        );
    });

    return (
        <>
            <h2>{question}</h2>
            <p>
                <TranslatedMessage id="gamemodes.wouldyourather.description" />
            </p>
            {!inputLock && !answer && values}
            {answer && (
                <div>
                    <TranslatedMessage
                        id="elements.result.youranswer"
                        values={{
                            answer,
                        }}
                    />
                </div>
            )}
        </>
    );
};
