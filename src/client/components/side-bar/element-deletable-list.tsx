import * as React from 'react';
import { ListItem } from 'material-ui';
import './element-deletable-list.css';
import './side-bar.css';
import { LightweightFile } from '../../model/file-interfaces';
import { ApplicationStateReducer } from '../../application-state';

var ClearIcon = require('react-icons/lib/md/clear');

export interface ElementOfDeletableListProps {
    lightFile: LightweightFile;
    reducer: ApplicationStateReducer;
    showPopUpFunction: Function;
    selectFileFunction: Function;
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
                        className="truncate item"
                        primaryText={this.props.lightFile.fileName}
                        onClick={() => this.props.selectFileFunction(this.props.lightFile)}
                    />
                </div>
                <div>
                    <ClearIcon
                        className="clearIcon"
                        onClick={() => this.props.showPopUpFunction(this.props.lightFile)}
                    />
                </div>
            </div>
        );
    }
}