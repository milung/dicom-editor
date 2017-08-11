import * as React from 'react';
import { ListItem } from 'material-ui';
import './element-deletable-list.css';
import './side-bar.css';
import { LightweightFile } from '../../model/file-interfaces';
import { getData } from '../../utils/file-store-util';
import { ApplicationStateReducer } from '../../application-state';
import { RecentFileStoreUtil } from '../../utils/recent-file-store-util';

var ClearIcon = require('react-icons/lib/md/clear');

export interface ElementOfDeletableListProps {
    lightFile: LightweightFile;
    reducer: ApplicationStateReducer;
    showPopUpFunction: Function;
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
                        className="truncate"
                        primaryText={this.props.lightFile.fileName}
                        onClick={() => this.selectCurrentFile(this.props.lightFile)}
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

    private selectCurrentFile(file: LightweightFile) {
        let fileFromDbPromise = getData(file);
        fileFromDbPromise.then(fileFromDb => {
            this.props.reducer.addLoadedFiles([fileFromDb]);
            this.props.reducer.updateCurrentFile(fileFromDb);
            let recentFileUtil: RecentFileStoreUtil = new RecentFileStoreUtil(this.props.reducer);
            recentFileUtil.handleStoringRecentFile(file);
        });
    }
}