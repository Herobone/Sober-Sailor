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

import React, { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Dough } from "../../helper/Dough";
import { useCookiesOpen } from "../../state/actions/settingActions";

export function CookieNotice(): JSX.Element {
    const [cookieNotice, setCookieNotice] = useCookiesOpen();

    useEffect(() => {
        setCookieNotice(!Dough.isDoughPresent());
    }, []);

    useEffect(() => {
        console.info("Cookies Dialog is now", cookieNotice);
    }, [cookieNotice]);

    return (
        <Dialog
            open={cookieNotice}
            onClose={() => console.warn("Can't close on click away")}
            aria-labelledby="cookie-notice-title"
            aria-describedby="cookie-notice-description"
        >
            <DialogTitle id="cookie-notice-title">Allow Cookies</DialogTitle>
            <DialogContent>
                <DialogContentText id="cookie-notice-description">
                    Let Google help apps determine location. This means sending anonymous location data to Google, even
                    when no apps are running.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setCookieNotice(false);
                        Dough.makeDough([]);
                    }}
                    color="secondary"
                    size="small"
                >
                    Only necessary
                </Button>
                <Button
                    onClick={() => {
                        setCookieNotice(false);
                        Dough.makeDough(["analytics", "marketing"]);
                        Dough.startAnalytics();
                    }}
                    color="primary"
                    startIcon={<CheckCircleIcon />}
                    variant="contained"
                    size="large"
                    autoFocus
                >
                    Allow All
                </Button>
            </DialogActions>
        </Dialog>
    );
}
