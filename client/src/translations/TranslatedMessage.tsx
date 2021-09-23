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
import { FormattedMessage } from "react-intl";
import { Props } from "react-intl/src/components/message";
import React from "react";
import { shallowEqual } from "react-intl/src/utils";
import { useDefaultTranslation } from "./DefaultTranslationProvider";

function areEqual(prevProps: Props, nextProps: Props): boolean {
    const { values, ...otherProps } = prevProps;
    const { values: nextValues, ...nextOtherProps } = nextProps;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return shallowEqual(nextValues, values) && shallowEqual(otherProps as any, nextOtherProps);
}

const UnMemoizedTranslatedMessage = (props: Props): JSX.Element => {
    const { messages } = useDefaultTranslation();
    if (props.id && Object.prototype.hasOwnProperty.call(messages, String(props.id))) {
        return React.createElement(FormattedMessage, { ...props, defaultMessage: messages[String(props.id)] });
    }
    return React.createElement(FormattedMessage, props);
};

UnMemoizedTranslatedMessage.displayName = "TranslatedMessage";

const MemoizedTranslatedMessage = React.memo<Props>(UnMemoizedTranslatedMessage, areEqual);
MemoizedTranslatedMessage.displayName = "MemoizedTranslatedMessage";

export const TranslatedMessage = MemoizedTranslatedMessage;
