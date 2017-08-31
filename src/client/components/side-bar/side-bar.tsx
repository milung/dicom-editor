import * as React from 'react';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';

import { ApplicationStateReducer } from '../../application-state';
import { HeavyweightFile, LightweightFile, SelectedFile } from '../../model/file-interfaces';
import './side-bar.css';
import TabTemplate from '.././tab-template';
import {
    saveFileIntoSavedDb,
    convertHeavyToLight
} from '../../utils/file-store-util';
import { RecentFileStoreUtil } from '../../utils/recent-file-store-util';
import { ColorDictionary } from '../../utils/colour-dictionary';
import LoadedFilesTab from './loaded-files-tab';
import SavedFilesTab from './saved-files-tab';
import OverridePopUpDialog from './override-popup-dialog';
import { DeletePopUpDialog } from './delete-popup-dialog';
import { Dialog, FlatButton } from 'material-ui';

export interface SideBarProps {
    reducer: ApplicationStateReducer;
    colorDictionary: ColorDictionary;
}

export interface SideBarState {
    loadedFiles: HeavyweightFile[];
    recentFiles: LightweightFile[];
    selectedFiles: SelectedFile[];
    savedFiles: LightweightFile[];
    openedOverrideDialog: boolean;
    openedDeleteDialog: boolean;
    fileInPopUp?: LightweightFile;
    openedEditationMessageDialog: boolean;
    isFileEdited: boolean;
}

export default class SideBar extends React.Component<SideBarProps, SideBarState> {

    public constructor(props: SideBarProps) {
        super(props);

        this.state = {
            loadedFiles: [],
            recentFiles: [],
            selectedFiles: [],
            savedFiles: [],
            openedOverrideDialog: false,
            openedDeleteDialog: false,
            fileInPopUp: undefined,
            openedEditationMessageDialog: false,
            isFileEdited: false,
        };

        this.handleCloseOverrideDialog = this.handleCloseOverrideDialog.bind(this);
        this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
        this.showPopUpOverrideConfirmation = this.showPopUpOverrideConfirmation.bind(this);
        this.showPopUpDeleteConfirmation = this.showPopUpDeleteConfirmation.bind(this);
        this.isFileEditing = this.isFileEditing.bind(this);
        this.saveFile = this.saveFile.bind(this);

    }

    public componentDidMount() {
        this.props.reducer.state$.subscribe(state => {
            this.setState({
                loadedFiles: state.loadedFiles,
                recentFiles: state.recentFiles,
                selectedFiles: state.selectedFiles,
                savedFiles: state.savedFiles,
                isFileEdited: state.entryBeingEdited !== undefined,
            });
        });
    }

    render() {
        return (
            <Paper className="side-bar">
                <Tabs
                    className="tabs-container"
                    contentContainerClassName="content-tab"
                    tabItemContainerStyle={{ display: 'block' }}
                    tabTemplate={TabTemplate}
                    tabTemplateStyle={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
                >
                    <Tab label="Loaded">
                        <LoadedFilesTab
                            reducer={this.props.reducer}
                            loadedFiles={this.state.loadedFiles}
                            selectedFiles={this.state.selectedFiles}
                            colorDictionary={this.props.colorDictionary}
                            className={'tab-container'}
                            initialCheckedCheckboxes={this.props.reducer.getState().selectedFiles.length}
                            isFileEditing={this.isFileEditing}
                        />
                    </Tab>
                    <Tab label="Saved">
                        <SavedFilesTab
                            reducer={this.props.reducer}
                            savedFiles={this.state.savedFiles}
                            showPopUpOverrideConfirmation={this.showPopUpOverrideConfirmation}
                            showPopUpDeleteConfirmation={this.showPopUpDeleteConfirmation}
                            saveFile={this.saveFile}
                            recentFiles={this.state.recentFiles}
                            colorDictionary={this.props.colorDictionary}
                            className={'tab-container'}
                            isFileEditing={this.isFileEditing}
                        />
                    </Tab>
                </Tabs>

                <OverridePopUpDialog
                    reducer={this.props.reducer}
                    saveFile={this.saveFile}
                    handleCloseOverrideDialog={this.handleCloseOverrideDialog}
                    openedOverrideDialog={this.state.openedOverrideDialog}
                />
                <DeletePopUpDialog
                    reducer={this.props.reducer}
                    handleCloseDeleteDialog={this.handleCloseDeleteDialog}
                    openedDeleteDialog={this.state.openedDeleteDialog}
                    fileInPopUp={this.state.fileInPopUp}
                />
                <Dialog
                    title={'Save editing changes before switching file?'}
                    actions={[
                        <FlatButton
                            key={1}
                            label={'Close'}
                            primary={true}
                            onTouchTap={() => { this.setState({ openedEditationMessageDialog: false }); }}
                        />]
                    }
                    modal={true}
                    open={this.state.openedEditationMessageDialog}
                >
                    <h3>You cannot switch between files while you editations are not saved with check mark.</h3>
                </Dialog>
            </Paper>
        );
    }

    private isFileEditing(): boolean {
        if (this.state.isFileEdited) {
            this.setState({ openedEditationMessageDialog: true });
            return true;
        }
        return false;
    }

    /**
     * @description Displays pop up window to ask user if file should be overriden.
     */
    private showPopUpOverrideConfirmation() {
        this.setState({
            openedOverrideDialog: true
        });
    }

    private showPopUpDeleteConfirmation(lightFile: LightweightFile) {
        this.setState({
            openedDeleteDialog: true,
            fileInPopUp: lightFile
        });
    }

    private handleCloseOverrideDialog() {
        this.setState({
            openedOverrideDialog: false
        });
    }

    private handleCloseDeleteDialog() {
        this.setState({
            openedDeleteDialog: false
        });
    }

    /**
     * @description Saves file into DB, app state and recent files
     * @param {HeavyweightFile} file file to save
     */
    private saveFile(file: HeavyweightFile) {
        let lightFile = convertHeavyToLight(file);
        let dbKey = saveFileIntoSavedDb(file);
        lightFile.dbKey = dbKey;
        let recentFileUtil: RecentFileStoreUtil = new RecentFileStoreUtil(this.props.reducer);
        recentFileUtil.handleStoringRecentFile(lightFile);
        this.props.reducer.addSavedFile(lightFile);
    }
}
