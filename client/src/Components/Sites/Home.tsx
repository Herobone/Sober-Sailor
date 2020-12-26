import React, {ReactElement} from 'react';
import '../../css/App.css';
import {Alert} from '../../helper/AlertTypes';
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

interface State {

}

class Home extends React.Component<Props, State> {

    render() {
        return (
            <div className="w3-center">
                <div className="w3-card-4 sailor-startpage-gameselector">
                    <header className="w3-container w3-yellow"><h1>
                        <FormattedMessage id="sobersailor.name"/>
                    </h1></header>

                    <div className="w3-container">
                        <p className="sailor-gameselect-button">
                            <Link to="mixed" className="w3-btn w3-round w3-orange w3-xlarge">
                                <FormattedMessage id="gamemodes.mixed"/>
                            </Link></p>
                        <p className="sailor-gameselect-button">
                            <Link to="/truthordare" className="w3-btn w3-round w3-orange w3-xlarge">
                                <FormattedMessage id="gamemodes.truthordare"/>
                            </Link></p>
                        <p className="sailor-gameselect-button">
                            <Link to="/saufpoly" className="w3-btn w3-round w3-orange w3-xlarge">
                                <FormattedMessage id="gamemodes.saufpoly"/>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

}

export default Home;
