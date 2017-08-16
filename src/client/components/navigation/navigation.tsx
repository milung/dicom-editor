import * as React from 'react';
import { MenuItem, Drawer, AppBar } from 'material-ui';
import './navigation.css';
import { ExportDialog } from '../export/export-dialog';
import { ApplicationStateReducer } from '../../application-state';
import { HeavyweightFile } from '../../model/file-interfaces';
import { OverridePopUpDialog } from './override-popup-dialog';
import { ConflictPopUpDialog } from './conflict-popup-dialog';
import { NavigationMenuUtil, ApplicationMenuItem } from './navigation-menu-util';
import { MultiSave } from './save-multiple-files';
import { ActionCompareArrows, FileFileDownload, ContentRemoveCircle, ContentSave } from 'material-ui/svg-icons';

export interface NavigationProps {
    reducer: ApplicationStateReducer;
}

export interface NavigationState {
    sideBarOpen: boolean;
    openedExportDialog: boolean;
    openedConflictDialog: boolean;
    openedOverrideDialog: boolean;
    conflictFiles: HeavyweightFile[];
    compareItem: ApplicationMenuItem;
    exportItem: ApplicationMenuItem;
    saveItem: ApplicationMenuItem;
    unloadItem: ApplicationMenuItem;
}

const enabledMenuItemStyle = {
    color: 'black'
};

const disabledMenuItemStyle = {
    color: 'gray',
    cursor: 'not-allowed'
};

export class Navigation extends React.Component<NavigationProps, NavigationState> {
    private saver: MultiSave;

    public constructor(props: NavigationProps) {
        super(props);
        this.handleCloseExportDialog = this.handleCloseExportDialog.bind(this);
        this.handleCloseOverwriteDialog = this.handleCloseOverwriteDialog.bind(this);
        this.handleCloseConflictDialog = this.handleCloseConflictDialog.bind(this);
        this.overwriteAll = this.overwriteAll.bind(this);
        this.skipAll = this.skipAll.bind(this);
        this.handleCancelOverwriteDialog = this.handleCancelOverwriteDialog.bind(this);
        this.showPopUpOverrideConfirmation = this.showPopUpOverrideConfirmation.bind(this);
        this.handleUnloadClick = this.handleUnloadClick.bind(this);
        this.handleCompareClick = this.handleCompareClick.bind(this);
        this.handleOneConflict = this.handleOneConflict.bind(this);
        this.handleMoreConflicts = this.handleMoreConflicts.bind(this);
        this.saver = new MultiSave(this.props.reducer, this.handleOneConflict, this.handleMoreConflicts);

        this.state = {
            sideBarOpen: false,
            openedExportDialog: false,
            openedConflictDialog: false,
            openedOverrideDialog: false,
            conflictFiles: [],
            compareItem: {
                text: '',
                disabled: false
            },
            exportItem: {
                text: '',
                disabled: false
            },
            saveItem: {
                text: '',
                disabled: false
            },

            unloadItem: {
                text: '',
                disabled: false
            }

        };
    }

    public componentDidMount() {
        this.props.reducer.state$.subscribe(state => {
            let menuUtil = new NavigationMenuUtil(state);
            let newMenu = menuUtil.getActualMenu();

            this.setState({
                compareItem: newMenu.compareItem,
                exportItem: newMenu.exportItem,
                saveItem: newMenu.saveItem,
                unloadItem: newMenu.unloadItem
            });

        });
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
                        style={this.state.exportItem.disabled ? disabledMenuItemStyle : enabledMenuItemStyle}
                        primaryText={this.state.exportItem.text}
                        onClick={() => this.showExportDialog()}
                        disabled={this.state.exportItem.disabled}
                        leftIcon={<FileFileDownload />}
                    />
                    <MenuItem
                        style={this.state.saveItem.disabled ? disabledMenuItemStyle : enabledMenuItemStyle}
                        primaryText={this.state.saveItem.text}
                        onClick={() => this.saver.handleSaveClick(this.state.saveItem.disabled)}
                        disabled={this.state.saveItem.disabled}
                        leftIcon={<ContentSave />}
                    />
                    <MenuItem
                        style={this.state.compareItem.disabled ? disabledMenuItemStyle : enabledMenuItemStyle}
                        primaryText={this.state.compareItem.text}
                        onClick={() => this.handleCompareClick()}
                        disabled={this.state.compareItem.disabled}
                        leftIcon={<ActionCompareArrows />}
                    />
                    <MenuItem
                        style={this.state.unloadItem.disabled ? disabledMenuItemStyle : enabledMenuItemStyle}
                        primaryText={this.state.unloadItem.text}
                        onClick={() => this.handleUnloadClick()}
                        disabled={this.state.unloadItem.disabled}
                        leftIcon={<ContentRemoveCircle />}
                    />
                    <ExportDialog
                        reducer={this.props.reducer}
                        handleClosePopUpDialog={this.handleCloseExportDialog}
                        openedPopUpDialog={this.state.openedExportDialog}
                    />
                    <OverridePopUpDialog
                        reducer={this.props.reducer}
                        saveFile={this.saver.saveFile}
                        handleCloseOverrideDialog={this.handleCloseOverwriteDialog}
                        openedOverrideDialog={this.state.openedOverrideDialog}
                        fileName={this.state.conflictFiles[0] ? this.state.conflictFiles[0].fileName : ''}
                        handleCancelOverrideDialog={this.handleCancelOverwriteDialog}
                    />
                    <ConflictPopUpDialog
                        handleCloseDialog={this.handleCloseConflictDialog}
                        overWriteAll={this.overwriteAll}
                        skipAll={this.skipAll}
                        decideForEach={this.showPopUpOverrideConfirmation}
                        numberOfConflicting={this.state.conflictFiles.length}
                        openedPopUpDialog={this.state.openedConflictDialog}
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
        if (!this.state.exportItem.disabled) {
            this.setState({
                openedExportDialog: true
            });
        }
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

    private handleCancelOverwriteDialog() {
        let arr = this.state.conflictFiles;
        arr.shift();
        this.setState({
            conflictFiles: arr
        });
        if (this.state.conflictFiles.length === 0) {
            this.handleCloseOverwriteDialog();
        }
    }

    private handleCloseOverwriteDialog() {
        this.setState({
            openedOverrideDialog: false,
            sideBarOpen: false,
            conflictFiles: []
        });
    }

    private handleCloseConflictDialog() {
        this.setState({
            openedConflictDialog: false,
            sideBarOpen: false
        });
    }

    private overwriteAll() {
        this.state.conflictFiles.forEach(file => {
            this.saver.saveFile(file);
        });
    }

    private skipAll() {
        this.setState({
            conflictFiles: []
        });
    }

    private handleOneConflict(inConflict: HeavyweightFile[]) {
        this.setState({
            conflictFiles: inConflict,
            openedOverrideDialog: true
        });
    }

    private handleMoreConflicts(inConflict: HeavyweightFile[]) {
        this.setState({
            openedConflictDialog: true,
            conflictFiles: inConflict
        });
    }

    private handleCompareClick() {
        if (!this.state.compareItem.disabled) {
            this.props.reducer.setComparisonActive(true);
            this.setState({ sideBarOpen: !this.state.sideBarOpen });
        }
    }

    private handleUnloadClick() {
        if (!this.state.unloadItem.disabled) {

            let filesToUnload = this.props.reducer.getSelectedFiles();
            if (filesToUnload.length === 0) {
                let current = this.props.reducer.getState().currentFile;
                if (current) {
                    filesToUnload = [current];
                }
            }
            this.props.reducer.removeLoadedFiles(filesToUnload);
            this.setState({ sideBarOpen: !this.state.sideBarOpen });
        }
    }
}