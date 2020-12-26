import React from 'react';
import { Component, RefObject } from 'react'
import { FormattedMessage } from 'react-intl';

interface Props {
    content: { [key: string]: string };
    callback: (value: string) => void;
    selected?: string;
}

interface State {
    selected: string | null
}

export class Dropdown extends Component<Props, State> {
    ref: RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.ref = React.createRef();
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);

        this.state = {
            selected: this.props.selected ? this.props.content[this.props.selected] : null
        }
    }

    toggleDropdown() {
        if (this.ref === null) {
            return;
        }
        if (this.ref.current !== null) {
            const cur = this.ref.current;
            if (cur.className.indexOf("w3-show") === -1) {
                cur.className += " w3-show";
            } else {
                cur.className = cur.className.replace(" w3-show", "");
            }
        }
    }

    handleDropdownClick(e: string, element: string) {
        this.props.callback(e);
        this.closeDropdown();
        this.setState({
            selected: element
        })
    }

    closeDropdown() {
        if (this.ref === null) {
            return;
        }
        if (this.ref.current !== null) {
            const cur = this.ref.current;
            cur.className = cur.className.replace(" w3-show", "");
        }
    }
    render() {
        let vals = [];
        for (const key in this.props.content) {
            if (this.props.content.hasOwnProperty(key)) {
                const element = this.props.content[key];
                vals.push(<div key={key} onClick={() => this.handleDropdownClick(key, element)} className="w3-bar-item w3-button">{element}</div>)
            }
        }
        return (
            <div className="w3-block w3-black">
                <button onClick={this.toggleDropdown} className="w3-button w3-black">
                    {this.state.selected !== null && this.state.selected}
                    {this.state.selected === null && <FormattedMessage id="elements.dropdown.select" />}
                    {" "}
                    <i className="fa fa-chevron-circle-down" aria-hidden="true" />
                </button>
                <div id="language-dropdown" ref={this.ref} className="w3-dropdown-content w3-bar-block w3-border">
                    {vals}
                </div>
            </div>
        )
    }
}

export default Dropdown
