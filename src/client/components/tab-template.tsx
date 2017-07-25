import * as React from 'react';

interface TabTemplateProps {
    selected: boolean;
    style: Object;
}

export default class TabTemplate extends React.Component<TabTemplateProps, {}> {
    public constructor(props: TabTemplateProps) {
        super(props);
    }

    render() {
        const templateStyle = this.props.style;

        if (!this.props.selected) {
            return null;
        }

        return (
            <div style={templateStyle}>
                {this.props.children}
            </div>
        );
    }
}