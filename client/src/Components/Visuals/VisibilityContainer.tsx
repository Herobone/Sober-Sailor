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
import { PropsWithChildren } from "react";
import { Container } from "@mui/material";

interface Props {}

export const VisibilityContainer = (props: PropsWithChildren<Props>): JSX.Element => {
    return (
        <Container sx={{ pt: "200px" }}>
            <Container
                sx={{
                    p: 5,
                    backgroundColor: "rgba(100, 100, 100, 0.5)",
                    backdropFilter: "blur(40%)",
                    borderRadius: 20,
                }}
            >
                {props.children}
            </Container>
        </Container>
    );
};
