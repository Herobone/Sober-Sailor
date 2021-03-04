import { Backdrop, Fade, Modal, Paper } from "@material-ui/core";
import SpeedDial from "@material-ui/lab/SpeedDial";
import MenuOpenIcon from "@material-ui/lab/SpeedDialIcon";
import { SpeedDialAction } from "@material-ui/lab";
import { SettingsRounded } from "@material-ui/icons";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CopyrightIcon from "@material-ui/icons/Copyright";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Settings } from "../Sites/Settings";
import { useDefaultStyles } from "../../css/Style";
import { CookieNotice } from "./CookieNotice";

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

export function GlobalOverlay(): JSX.Element {
    const classes = useDefaultStyles();
    const [settingsShown, setSettingsShown] = useState(false);
    const [speedDialShown, setSpeedDialShown] = useState(false);
    const intl = useIntl();

    const openSettings = (): void => {
        setSettingsShown(true);
        setSpeedDialShown(false);
    };

    const closeSettings = (): void => {
        setSettingsShown(false);
        setSpeedDialShown(false);
    };

    return (
        <>
            <CookieNotice />
            <Modal open={settingsShown} onClose={closeSettings} closeAfterTransition>
                <Fade in={settingsShown}>
                    <Paper elevation={5} className={classes.settingsModal}>
                        <div className={classes.settingsModal}>
                            <Settings />
                        </div>
                    </Paper>
                </Fade>
            </Modal>
            <SpeedDial
                ariaLabel="Menu"
                className={classes.settingsButton}
                icon={<MenuOpenIcon />}
                onClose={() => setSpeedDialShown(false)}
                onOpen={() => {
                    setSpeedDialShown(true);
                    console.log("Open lil cunt");
                }}
                open={speedDialShown}
            >
                <SpeedDialAction
                    key="settings_speeddial"
                    icon={<SettingsRounded />}
                    tooltipTitle={<FormattedMessage id="account.navigation.settings" />}
                    title={intl.formatMessage({ id: "account.navigation.settings" })}
                    tooltipOpen
                    onClick={openSettings}
                />
                <SpeedDialAction
                    key="info_speeddial"
                    icon={<InfoOutlinedIcon />}
                    tooltipTitle={<FormattedMessage id="navigation.information" />}
                    title={intl.formatMessage({ id: "navigation.information" })}
                    tooltipOpen
                    onClick={() => {
                        setSpeedDialShown(false);
                    }}
                />
                <SpeedDialAction
                    key="credits_speeddial"
                    icon={<CopyrightIcon />}
                    tooltipTitle={<FormattedMessage id="navigation.credits" />}
                    title={intl.formatMessage({ id: "navigation.credits" })}
                    tooltipOpen
                    onClick={() => {
                        setSpeedDialShown(false);
                    }}
                />
                <SpeedDialAction
                    key="cookies_speeddial"
                    icon={<FastfoodIcon />}
                    tooltipTitle={<FormattedMessage id="navigation.cookies" />}
                    title={intl.formatMessage({ id: "navigation.cookies" })}
                    tooltipOpen
                    onClick={() => {
                        setSpeedDialShown(false);
                    }}
                />
            </SpeedDial>

            <Backdrop open={speedDialShown || settingsShown} />
        </>
    );
}
