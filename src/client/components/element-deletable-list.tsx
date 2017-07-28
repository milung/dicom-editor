import * as React from 'react';
import { ListItem } from 'material-ui';
import './element-deletable-list.css';
import { LightweightFile } from '../model/file-interfaces';

var ClearIcon = require('react-icons/lib/md/clear');

export interface ElementOfDeletableListProps {
    lightFile: LightweightFile;
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
                        onClick={() => this.props.deleteFunction(this.props.lightFile)}
                        primaryText={this.props.lightFile.fileName}
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