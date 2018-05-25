import React, { Component } from 'react';
import {
    Card
} from 'rmwc/Card';

export default class TextCard extends Component {
    render() {
        return <Card className="text-card" onClick={this.onClick.bind(this)}>
            <span className="mdc-typography--headline6">{this.props.title}</span>
        </Card>
    }

    onClick(e) {
        if (this.props.onClick) this.props.onClick();
    }
}