import * as React from 'react';
import { MenuItem, Drawer, AppBar } from 'material-ui';
import './navigation.css';
import { ExportDialog } from '../export/export-dialog';
import { ApplicationStateReducer } from '../../application-state';
import { HeavyweightFile } from '../../model/file-interfaces';
import { OverridePopUpDialog } from './override-popup-dialog';
import { isFileSavedInDb } from '../../utils/file-store-util';
import {
    saveFileIntoSavedDb,
    convertHeavyToLight
} from '../../utils/file-store-util';
import { RecentFileStoreUtil } from '../../utils/recent-file-store-util';

export interface NavigationProps {
    reducer: ApplicationStateReducer;
}

export interface NavigationState {
    sideBarOpen: boolean;
    openedExportDialog: boolean;
    openedOverrideDialog: boolean;
}

export class Navigation extends React.Component<NavigationProps, NavigationState> {
    public constructor(props: NavigationProps) {
        super(props);
        this.handleCloseExportDialog = this.handleCloseExportDialog.bind(this);
        this.handleCloseOverrideDialog = this.handleCloseOverrideDialog.bind(this);
        this.saveFile = this.saveFile.bind(this);

        this.state = {
            sideBarOpen: false,
            openedExportDialog: false,
            openedOverrideDialog: false
        };
    }

    public render() {
        return (

            <div>
                <Drawer
                    open={this.state.sideBarOpen}
                    docked={false}

                    onRequestChange={(sideBarOpen) => this.setState({ sideBarOpen })}
                >
                    <div id="logo-left-wrapper">
                        <img src="../../../assets/img/logo.png" alt="Dicom Viewer" id="logo-left" />
                    </div>
                    <div id="dicom-title"><span>DICOM VIEWER</span></div>
                    <MenuItem
                        primaryText="Export"
                        onClick={() => this.showExportDialog()}
                    />
                    <MenuItem
                        primaryText="Save here"
                        onClick={() => this.handleSaveClick()}
                    />
                    <ExportDialog
                        reducer={this.props.reducer}
                        handleClosePopUpDialog={this.handleCloseExportDialog}
                        openedPopUpDialog={this.state.openedExportDialog}
                    />
                    <OverridePopUpDialog
                        reducer={this.props.reducer}
                        saveFile={this.saveFile}
                        handleCloseOverrideDialog={this.handleCloseOverrideDialog}
                        openedOverrideDialog={this.state.openedOverrideDialog}
                    />
                </Drawer>

                <AppBar
                    className="app-bar"
                    title="DICOM VIEWER"
                    onLeftIconButtonTouchTap={() => { this.setState({ sideBarOpen: !this.state.sideBarOpen }); }}
                />

            </div>

        );
    }

    private showExportDialog() {
        this.setState({
            openedExportDialog: true
        });
    }

    private handleCloseExportDialog() {
        this.setState({
            openedExportDialog: false,
            sideBarOpen: false
        });
    }

    /**
     * @description Displays pop up window to ask user if file should be overriden.
     */
    private showPopUpOverrideConfirmation() {
        this.setState({
            openedOverrideDialog: true
        });
    }

    private handleCloseOverrideDialog() {
        this.setState({
            openedOverrideDialog: false,
            sideBarOpen: false
        });
    }

    private async handleSaveClick() {
        let file: HeavyweightFile | undefined = this.props.reducer.getState().currentFile;
        if (file) {
            file.timestamp = (new Date()).getTime();
            let isSaved = await isFileSavedInDb(file);
            if (!isSaved) {
                this.saveFile(file);
            } else {
                this.showPopUpOverrideConfirmation();
            }
        }
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
        this.handleCloseOverrideDialog();
    }
}