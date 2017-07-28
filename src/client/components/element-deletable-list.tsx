import * as React from 'react';
import { ListItem } from 'material-ui';
import './element-deletable-list.css';

var ClearIcon = require('react-icons/lib/md/clear');

export interface ElementOfDeletableListProps {
    fileName: string;
    deleteFunction: Function;
}

export interface ElementOfDeletableListState {
    
}

export class ElementOfDeletableList extends React.Component<ElementOfDeletableListProps, ElementOfDeletableListState> {
    public constructor(props: ElementOfDeletableListProps) {
        super(props);
    }

    public render() {
        return (
            <div className="deletableListItem">
                <div className="td">
                    <ListItem
                       // onClick={() => this.props.selectFunction(this.props.item)}
                        primaryText={this.props.fileName}
                    />
                </div>
                <div>
                    <ClearIcon
                        className="clearIcon"
                    />
                </div>
            </div>
        );
    }
}