/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2021-2022.
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
import { useEffect, useState } from "react";
import Util from "sobersailor-common/lib/Util";
import { useFiller } from "../../state/actions/settingActions";
import { useAlert } from "../Functional/AlertProvider";
import { Alerts } from "../../helper/AlertTypes";

export const CatPontent = (): JSX.Element => {
    const [imageURL, setImageURL] = useState<string>();
    const [endpointURL, setEndpointURL] = useState("");

    const [filler] = useFiller();

    const { createAlert } = useAlert();

    const catEndpoint = "https://api.thecatapi.com/v1/images/search";
    const dogEndpoint = "https://api.thedogapi.com/v1/images/search";
    const memeEndpoint = "https://api.reddit.com/r/memes/top";

    const newImage = async (): Promise<void> => {
        if (filler === "none") {
            // eslint-disable-next-line unicorn/no-useless-undefined
            setImageURL(undefined);
            return;
        }

        const re = await fetch(endpointURL);
        const json = await re.json();
        if (filler === "memes") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = Util.getRandomElement<any>(json.data.children).data;
            if (!data.is_video) {
                setImageURL(data.url);
            }
        } else {
            setImageURL(json[0].url);
        }
    };

    useEffect(() => {
        newImage().catch(console.warn);
        const interval = setInterval(() => newImage().catch(console.warn), 10_000);

        return function cleanup() {
            clearInterval(interval);
        };
    }, [endpointURL]);

    const updateFiller = (): void => {
        switch (filler) {
            case "cats":
                setEndpointURL(catEndpoint);
                break;
            case "dogs":
                setEndpointURL(dogEndpoint);
                break;
            case "memes":
                setEndpointURL(memeEndpoint);
                break;
            case "none":
                setEndpointURL("");
                break;
            default:
                createAlert(Alerts.ERROR, "Unknown filler");
        }
    };

    useEffect(updateFiller, []);

    useEffect(updateFiller, [filler]);

    return (
        <>
            {imageURL && (
                <img
                    src={imageURL}
                    alt="Waiting..."
                    style={{
                        maxWidth: "100%",
                        maxHeight: "85vh",
                    }}
                />
            )}
        </>
    );
};
