import * as React from 'react';
import { ListItem } from 'material-ui';
import './element-deletable-list.css';
import { LightweightFile } from '../../model/file-interfaces';
import { getData } from '../../utils/file-store-util';
import { ApplicationStateReducer } from '../../application-state';

var ClearIcon = require('react-icons/lib/md/clear');

export interface ElementOfDeletableListProps {
    lightFile: LightweightFile;
    deleteFunction: Function;
    reducer: ApplicationStateReducer;
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
                        primaryText={this.props.lightFile.fileName}
                        onClick={() => this.selectCurrentFile(this.props.lightFile)}
                    />
                </div>
                <div>
                    <ClearIcon
                        className="clearIcon"
                        onClick={() => this.props.deleteFunction(this.props.lightFile)}
                    />
                </div>
            </div>
        );
    }

    private selectCurrentFile(file: LightweightFile) {
        let fileFromDb =  getData(file);
        fileFromDb.then(file => {
            this.props.reducer.addLoadedFiles([file]);
            this.props.reducer.updateCurrentFile(file);
        });
    }
}