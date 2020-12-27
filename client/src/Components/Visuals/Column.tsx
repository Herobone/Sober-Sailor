import React, { Component } from "react";

interface ColumnProps {
  additionalClasses?: string;
}

export class Column extends Component<ColumnProps> {
  render() {
    const topLevelClass = `w3-col ${this.props.additionalClasses}`;
    return (
      <div className={topLevelClass}>
        <div className="w3-card w3-round w3-white w3-container">{this.props.children}</div>
      </div>
    );
  }
}

export default Column;
