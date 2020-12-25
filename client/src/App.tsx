import React, {Component, ReactElement, RefObject} from 'react';
import AlertProvider from './Components/Functional/AlertProvider';
import LanguageContainer from './translations/LanguageContainer';
import './css/index.css';
import Routed from './Components/Functional/Routed';
import {Alert} from './helper/AlertTypes';

interface Props {

}

interface State {
    createAlert: (type: Alert, message: string | ReactElement, header?: ReactElement) => void;
    changeLanguage: (locale: string) => void;
    currentLocale: string;
}

export default class App extends Component<Props, State> {

    alertRef: RefObject<AlertProvider>;
    langRef: RefObject<LanguageContainer>;

    state = {
        createAlert: () => {
            console.error("Tried to create alert on unmounted AlertProvider!");
        },
        changeLanguage: () => {
            console.error("Tried to create alert on unmounted LanguageContainer!");
        },
        currentLocale: "en"
    }

    constructor(props: Props) {
        super(props);
        this.alertRef = React.createRef();
        this.langRef = React.createRef();
    }

    componentDidMount() {
        if (this.alertRef.current) {
            this.setState({createAlert: this.alertRef.current.createAlert});
        }
        if (this.langRef.current) {
            this.setState({
                changeLanguage: this.langRef.current.changeLanguage,
                currentLocale: this.langRef.current.getCurrentLocale()
            });
        }
    }

    render() {
        return (
            <React.StrictMode>
                <LanguageContainer ref={this.langRef}>
                    <AlertProvider ref={this.alertRef}>
                        <Routed changeLanguage={this.state.changeLanguage}
                                currentLocale={this.state.currentLocale}
                                createAlert={this.state.createAlert}/>
                    </AlertProvider>
                </LanguageContainer>
            </React.StrictMode>
        )
    }
}
