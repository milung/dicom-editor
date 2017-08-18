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
            fileInPopUp: undefined
        };

        this.handleCloseOverrideDialog = this.handleCloseOverrideDialog.bind(this);
        this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
        this.showPopUpOverrideConfirmation = this.showPopUpOverrideConfirmation.bind(this);
        this.showPopUpDeleteConfirmation = this.showPopUpDeleteConfirmation.bind(this);
        this.saveFile = this.saveFile.bind(this);
        
    }

    public componentDidMount() {
        this.props.reducer.state$.subscribe(state => {
            this.setState({
                loadedFiles: state.loadedFiles,
                recentFiles: state.recentFiles,
                selectedFiles: state.selectedFiles,
                savedFiles: state.savedFiles
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
            </Paper>
        );
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
