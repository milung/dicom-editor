import * as React from 'react';
import { ApplicationStateReducer } from '../../application-state';
import { List, ListItem } from 'material-ui';
import { ElementOfDeletableList } from './element-deletable-list';
import { LightweightFile, HeavyweightFile } from '../../model/file-interfaces';
import { isFileSavedInDb, getData } from '../../utils/file-store-util';
import { ActionWatchLater, ContentSave } from 'material-ui/svg-icons';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './side-bar.css';
import { RecentFileStoreUtil } from '../../utils/recent-file-store-util';
import { storeFilesToDB } from '../../utils/loaded-files-store-util';

interface SavedFilesTabProps {
    reducer: ApplicationStateReducer;
    savedFiles: LightweightFile[];
    recentFiles: LightweightFile[];
    showPopUpOverrideConfirmation: Function;
    showPopUpDeleteConfirmation: Function;
    saveFile: Function;
    className: string;
    colorDictionary: ColorDictionary;
    isFileEditing?: Function;
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
        this.selectCurrentFile = this.selectCurrentFile.bind(this);
        this.loadFromSaved = this.loadFromSaved.bind(this);
        this.updateCurrentFromRecentFile = this.updateCurrentFromRecentFile.bind(this); 
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
                                    onClick={() => this.selectCurrentFile(item)}
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
                                    selectFileFunction={this.loadFromSaved}
                                />
                            );
                        })}
                    />
                </List>
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

    private selectCurrentFile(file: LightweightFile) {
        if (this.props.isFileEditing && this.props.isFileEditing()) {
            return;
        }
        this.updateCurrentFromRecentFile(file);
        this.props.reducer.removeAllSelectedFiles();
        this.props.reducer.setComparisonActive(false);
        this.props.colorDictionary.reset();
    }

    private updateCurrentFromRecentFile(file: LightweightFile) {
        let fileStorage = new RecentFileStoreUtil(this.props.reducer);
        fileStorage.getRecentFile(file.dbKey).then(data => {
            this.props.reducer.addLoadedFiles([data]);
            storeFilesToDB(this.props.reducer);
        });
        fileStorage.handleStoringRecentFile(file);
    }

    private loadFromSaved(file: LightweightFile) {
        getData(file).then((data) => {
            this.props.reducer.addLoadedFiles([data]);
            let recentUtil = new RecentFileStoreUtil(this.props.reducer);
            recentUtil.handleStoringRecentFile(file);
        });
    }
}