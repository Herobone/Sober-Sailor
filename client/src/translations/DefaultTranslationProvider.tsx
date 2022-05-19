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

import React from "react";
import { MessageFormatElement, useIntl } from "react-intl";
import { FormatXMLElementFn, PrimitiveType } from "intl-messageformat";
import { Options as IntlMessageFormatOptions } from "intl-messageformat/src/core";
import { MessageDescriptor } from "@formatjs/intl/src/types";

export type MessageType = Record<string, string> | Record<string, MessageFormatElement[]>;
export type DefaultTranslationType = {
    messages: MessageType;
    formatMessage(
        descriptor: MessageDescriptor,
        values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
        opts?: IntlMessageFormatOptions,
    ): string;
};

export const DefaultTranslationContext = React.createContext<DefaultTranslationType>({
    messages: {},
    formatMessage(): string {
        throw new Error("Not initialized yet");
    },
});

export const useDefaultTranslation = (): DefaultTranslationType => React.useContext(DefaultTranslationContext);

export function DefaultTranslationProvider(props: React.PropsWithChildren<{ messages: MessageType }>): JSX.Element {
    const intl = useIntl();
    const formatMessage = (
        descriptor: MessageDescriptor,
        values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
        opts?: IntlMessageFormatOptions,
    ): string => {
        if (descriptor.id) {
            const id = String(descriptor.id);
            if (intl.messages && Object.prototype.hasOwnProperty.call(intl.messages, id)) {
                return intl.formatMessage(descriptor, values, opts);
            } else if (Object.prototype.hasOwnProperty.call(props.messages, id)) {
                return intl.formatMessage({ ...descriptor, defaultMessage: props.messages[id] }, values, opts);
            }
        }
        return intl.formatMessage(descriptor, values, opts);
    };
    return (
        <DefaultTranslationContext.Provider value={{ messages: props.messages, formatMessage }}>
            {props.children}
        </DefaultTranslationContext.Provider>
    );
}
