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
import { useEffect, useState } from "react";

export const CatPontent = (): JSX.Element => {
    const [catURL, setCatURL] = useState("");

    useEffect(() => {
        setInterval(() => {
            fetch("https://api.thecatapi.com/v1/images/search")
                .then((re) => re.json())
                .then((re) => setCatURL(re[0].url))
                .catch(console.error);
        }, 10_000);
    }, []);
    return (
        <>
            <img src={catURL} alt="A cat" />
        </>
    );
};
