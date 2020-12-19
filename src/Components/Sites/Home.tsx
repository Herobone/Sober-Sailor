import React, {ReactElement} from 'react';
import '../../css/App.css';
import {Alert} from '../../helper/AlertTypes';
import {FormattedMessage} from "react-intl";

interface Props {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
}

interface State {

}

class Home extends React.Component<Props, State> {

    render() {
        return (
            <div>
                <FormattedMessage id="general.placeholder"/>
            </div>
        );
    }
}

export default Home;
