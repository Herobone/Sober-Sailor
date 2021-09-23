/*****************************
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
import { Paper, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useRef, useState } from "react";
import Util from "sobersailor-common/lib/Util";
import { useDefaultTranslation } from "../../translations/DefaultTranslationProvider";

interface Props {
    penalty: number;
}

const useStyle = makeStyles((theme: Theme) => ({
    root: {
        fontFamily: ["Luckiest Guy", "cursive"].join(","),
        fontSize: "4em",
    },
    text: {
        fontFamily: "Amatic SC",
        fontSize: "7vw",
        color: theme.palette.text.primary,
        textAlign: "center",
        position: "relative",
    },
}));

export function PenaltyScreen(props: Props): JSX.Element {
    const classes = useStyle();
    const intl = useDefaultTranslation();
    const arc = 130;
    const drinkText = intl.formatMessage({ id: "elements.results.youdrink" });
    const drinkChars = drinkText.split("");
    const drinkDegree = arc / drinkChars.length;

    const sipText = intl.formatMessage({ id: "general.sips" });
    const sipChars = sipText.split("");

    const rootRef = useRef<HTMLDivElement>(null);

    const [radius, setRadius] = useState(0);

    const reportWindowSize = (): void => {
        let w = window.innerWidth;
        if (rootRef.current) {
            w = rootRef.current.offsetWidth;
        }
        setRadius(w / 2 - 50);
    };

    useEffect(() => {
        window.addEventListener("resize", reportWindowSize);
        reportWindowSize();
        return function cleanup() {
            window.removeEventListener("resize", reportWindowSize);
        };
    }, []);

    return (
        <div style={{ width: "97%", paddingLeft: "3%", paddingTop: "1%" }}>
            <Paper
                sx={{
                    paddingTop: { xs: "2vw", sm: "3vw" },
                    paddingBottom: "1px",
                }}
                ref={rootRef}
            >
                <h2
                    className={classes.text}
                    style={{
                        top: `${-radius / 4}px`,
                    }}
                >
                    {drinkChars.map((char, i) => (
                        <span
                            key={`heading-span-${i}`}
                            style={{
                                position: "absolute",
                                transform: `rotate(${drinkDegree * i - arc / 2}deg)`,
                                transformOrigin: `0 ${radius}px 0`,
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </h2>
                <br />
                <h2
                    style={{
                        top: `${-radius / 5}px`,
                        fontSize: "12vw",
                        textAlign: "center",
                        position: "relative",
                    }}
                >
                    {props.penalty}
                </h2>
                <br />
                <h2
                    className={classes.text}
                    style={{
                        position: "relative",
                        top: `${-radius / 1.5}px`,
                    }}
                >
                    {sipChars.map((char, i) => (
                        <span
                            key={`drunken-letter-${i}`}
                            style={{
                                position: "absolute",
                                left: `calc(50% - (${sipChars.length / 2} * 1em) + (${i} * 1em))`,
                                transform: `rotate(${Util.random(-20, 20)}deg)`,
                                transformOrigin: "0 0",
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </h2>
            </Paper>
        </div>
    );
}
