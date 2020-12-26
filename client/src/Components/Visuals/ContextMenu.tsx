import { Component, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl';


interface Props {
    content: Map<number, string>;
    callback: (value: number) => void;
}

class ContextMenu extends Component<Props> {
    state = {
        xPos: "0px",
        yPos: "0px:",
        showMenu: false
    }
    constructor(props: Props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
        document.addEventListener("contextmenu", this.handleContextMenu);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
        document.removeEventListener("contextmenu", this.handleContextMenu);
    }

    handleClick() {
        if (this.state.showMenu) this.setState({ showMenu: false });
    }

    handleContextMenuClick(e: number, element: string) {
        this.props.callback(e);
        this.setState({
            selected: element
        })
    }

    handleContextMenu(e: MouseEvent) {
        e.preventDefault();

        this.setState({
            xPos: `${e.pageX}px`,
            yPos: `${e.pageY}px`,
            showMenu: true,
        });
    }

    render() {
        const { showMenu, yPos, xPos } = this.state;
        if (showMenu) {
            let vals : ReactElement[] = [];
            this.props.content.forEach((element: string, key: number) => {
                vals.push(<li key={key} onClick={() => this.handleContextMenuClick(key, element)} className="w3-bar-item w3-button"><FormattedMessage id={element} /></li>)
            })
            return (
                <ul
                    className="w3-block w3-black w3-dropdown-content w3-bar-block w3-border hb-context-menu"
                    style={{
                        top: yPos,
                        left: xPos,
                    }}
                >
                    {vals}
                </ul>
            );
        } else {
            return null;
        }
    }
}

export default ContextMenu
