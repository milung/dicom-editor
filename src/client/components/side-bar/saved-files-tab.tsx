import * as React from 'react';
import { ApplicationStateReducer } from '../../application-state';
import { List, RaisedButton } from 'material-ui';
import { ElementOfDeletableList } from './element-deletable-list';
import { LightweightFile, HeavyweightFile } from '../../model/file-interfaces';
import { isFileSavedInDb } from '../../utils/file-store-util';

interface SavedFilesTabProps {
    reducer: ApplicationStateReducer;
    savedFiles: LightweightFile[];
    showPopUpOverrideConfirmation: Function;
    showPopUpDeleteConfirmation: Function;
    saveFile: Function;
    className: string;
}

interface SavedFilesTabState {

}

export default class SavedFilesTab extends React.Component<SavedFilesTabProps, SavedFilesTabState> {
    constructor(props: SavedFilesTabProps) {
        super(props);

        this.handleSaveClick = this.handleSaveClick.bind(this);
    }

    render() {
        return (
            <div className={this.props.className}>
                <List style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                    {this.props.savedFiles.map((item, index) => {

                        return (
                            <ElementOfDeletableList
                                key={index}
                                lightFile={item}
                                showPopUpFunction={this.props.showPopUpDeleteConfirmation}
                                reducer={this.props.reducer}
                            />
                        );
                    })}
                </List>
                <RaisedButton
                    className="compare-button"
                    label="Save current file"
                    onClick={this.handleSaveClick}
                    primary={true}
                    disabled={this.props.reducer.getState().currentFile ? false : true}
                />
            </div>
        );
    }

    public async handleSaveClick() {
        let file: HeavyweightFile | undefined = this.props.reducer.getState().currentFile;
        if (file) {
            file.timestamp = (new Date()).getTime();
            let isSaved = await isFileSavedInDb(file);
            if (!isSaved) {
                this.props.saveFile(file);
            } else {
                this.props.showPopUpOverrideConfirmation();
            }
        }
    }
}