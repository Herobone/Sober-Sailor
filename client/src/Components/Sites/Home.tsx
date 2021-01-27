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

import React, { PureComponent } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { WithStyles, withStyles } from "@material-ui/styles";
import { Button, Container } from "@material-ui/core";
import RowingOutlined from "@material-ui/icons/RowingOutlined";
import { DefaultStyle } from "../../css/Style";
import { AlertContext } from "../Functional/AlertProvider";

interface Props extends WithStyles<typeof DefaultStyle> {}

interface State {}

class HomeClass extends PureComponent<Props, State> {
    static contextType = AlertContext;

    context!: React.ContextType<typeof AlertContext>;

    render(): JSX.Element {
        const { classes } = this.props;
        return (
            <Container maxWidth="sm" className={classes.startPage}>
                <h1 className={classes.h1}>
                    <FormattedMessage id="sobersailor.name" />
                </h1>

                <Button
                    variant="outlined"
                    color="secondary"
                    component={Link}
                    to="/mixed"
                    className={classes.gameSelectButton}
                    size="large"
                    fullWidth
                >
                    <RowingOutlined className={classes.gameSelectIcon} />
                    <FormattedMessage id="gamemodes.start" />
                </Button>
            </Container>
        );
    }
}

export const Home = withStyles(DefaultStyle)(HomeClass);
