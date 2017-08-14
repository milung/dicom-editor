import * as React from 'react';
import { ApplicationStateReducer } from '../../application-state';
import { List, RaisedButton, ListItem } from 'material-ui';
import { ElementOfDeletableList } from './element-deletable-list';
import { LightweightFile, HeavyweightFile } from '../../model/file-interfaces';
import { isFileSavedInDb } from '../../utils/file-store-util';
import { ActionWatchLater, ContentSave } from 'material-ui/svg-icons';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './side-bar.css';

interface SavedFilesTabProps {
    reducer: ApplicationStateReducer;
    savedFiles: LightweightFile[];
    recentFiles: LightweightFile[];
    showPopUpOverrideConfirmation: Function;
    showPopUpDeleteConfirmation: Function;
    saveFile: Function;
    className: string;
    colorDictionary: ColorDictionary;
}

interface SavedFilesTabState {
    recentFilesOpen: boolean;
    savedFilesOpen: boolean;
}

export default class SavedFilesTab extends React.Component<SavedFilesTabProps, SavedFilesTabState> {
    constructor(props: SavedFilesTabProps) {
        super(props);

        this.state = {
            recentFilesOpen: false,
            savedFilesOpen: true
        };

        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleRecentFilesToggle = this.handleRecentFilesToggle.bind(this);
        this.handleSavedFilesToggle = this.handleSavedFilesToggle.bind(this);
        this.selectCurrentFileFromRecentFile = this.selectCurrentFileFromRecentFile.bind(this);
    }

    render() {
        let sortedSaved = this.props.savedFiles.sort((fileA, fileB) => {
            return fileA.fileName.localeCompare(fileB.fileName);
        });
        return (
            <div className={this.props.className}>
                <List style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                    <div className="recent-files-tab">
                        <ListItem
                            onTouchTap={this.handleRecentFilesToggle}
                            primaryText="Recent files"
                            leftIcon={<ActionWatchLater />}
                            open={this.state.recentFilesOpen}
                            onNestedListToggle={this.handleRecentFilesToggle}
                            nestedItems={this.props.recentFiles.map((item, index) => (
                                <ListItem
                                    key={index}
                                    onClick={() => this.selectCurrentFileFromRecentFile(item)}
                                    primaryText={item.fileName}
                                />
                            ))}
                        />
                    </div>

                    <ListItem
                        onTouchTap={this.handleSavedFilesToggle}
                        primaryText="Saved files"
                        leftIcon={<ContentSave />}
                        open={this.state.savedFilesOpen}
                        onNestedListToggle={this.handleSavedFilesToggle}
                        nestedItems={sortedSaved.map((item, index) => {
                            return (
                                <ElementOfDeletableList
                                    key={index}
                                    lightFile={item}
                                    showPopUpFunction={this.props.showPopUpDeleteConfirmation}
                                    reducer={this.props.reducer}
                                />
                            );
                        })}
                    />
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

    private handleSavedFilesToggle() {
        this.setState({
            savedFilesOpen: !this.state.savedFilesOpen
        });
    }

    private handleRecentFilesToggle() {
        this.setState({
            recentFilesOpen: !this.state.recentFilesOpen
        });
    }

    private selectCurrentFileFromRecentFile(file: LightweightFile) {
        this.props.reducer.removeAllSelectedFiles();
        this.props.reducer.setComparisonActive(false);
        this.props.colorDictionary.reset();
        this.props.reducer.updateCurrentFromRecentFile(file);
    }

}