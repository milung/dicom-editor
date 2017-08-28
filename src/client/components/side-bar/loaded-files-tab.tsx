import * as React from 'react';
import { List } from 'material-ui';
import { ElementOfSelectableList } from './element-selectable-list';
import { HeavyweightFile, SelectedFile } from '../../model/file-interfaces';
import { ApplicationStateReducer } from '../../application-state';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './side-bar.css';
import { PalleteButtonMenu, PalleteItem } from '../pallete-button-menu/pallete-button-menu';
import { ActionCompareArrows, FileFileDownload, ContentSave, ContentRemoveCircle } from 'material-ui/svg-icons';
import { NavigationMenuUtil } from '../navigation/navigation-menu-util';
import { ExportDialog } from '../export/export-dialog';
import { MultiSave } from '../navigation/save-multiple-files';
import { ConflictPopUpDialog } from '../navigation/conflict-popup-dialog';
import { OverridePopUpDialog } from '../navigation/override-popup-dialog';
import {
    switchCurrentLoadedFile, storeComparisonActive,
    deleteAllSelectedFilesFromDB, storeSelectedCompareFilesToDB, deleteFileFromLoaded
} from '../../utils/loaded-files-store-util';

interface LoadedFilesTabProps {
    reducer: ApplicationStateReducer;
    loadedFiles: HeavyweightFile[];
    selectedFiles: SelectedFile[];
    colorDictionary: ColorDictionary;
    className: string;
    initialCheckedCheckboxes: number;
}

interface LoadedFilesTabState {
    checkedCheckboxes: number;
    comparePalleteItem: PalleteItem;
    exportPalleteItem: PalleteItem;
    savePalleteItem: PalleteItem;
    unloadPalleteItem: PalleteItem;
    openExportDialog: boolean;
    conflictFiles: HeavyweightFile[];
    openedConflictDialog: boolean;
    openedOverrideDialog: boolean;
}

export default class LoadedFilesTab extends React.Component<LoadedFilesTabProps, LoadedFilesTabState> {
    private static saver: MultiSave;

    constructor(props: LoadedFilesTabProps) {
        super(props);
        this.state = {
            checkedCheckboxes: this.props.initialCheckedCheckboxes,
            openExportDialog: false,
            openedConflictDialog: false,
            openedOverrideDialog: false,
            conflictFiles: [],

            comparePalleteItem: {
                text: 'Compare files',
                onClick: () => { this.handleCompareClick(); },
                icon: (<ActionCompareArrows />),
                disabled: true
            },

            exportPalleteItem: {
                text: 'Export file',
                onClick: () => { this.handleOpenExportDialog(); },
                icon: (<FileFileDownload />),
                disabled: true
            },

            savePalleteItem: {
                text: 'Save file',
                onClick: () => { this.handleSaveClick(); },
                icon: (<ContentSave />),
                disabled: true
            },

            unloadPalleteItem: {
                text: 'Unload file',
                onClick: () => { this.handleUnloadFiles(); },
                icon: (<ContentRemoveCircle />),
                disabled: true
            }
        };

        this.handleUnloadFiles = this.handleUnloadFiles.bind(this);
        this.handleOpenExportDialog = this.handleOpenExportDialog.bind(this);
        this.handleCloseExportDialog = this.handleCloseExportDialog.bind(this);
        this.changeNumberOfCheckedBoxes = this.changeNumberOfCheckedBoxes.bind(this);
        this.getColor = this.getColor.bind(this);
        this.handleCompareClick = this.handleCompareClick.bind(this);
        this.isChecked = this.isChecked.bind(this);
        this.selectCurrentFile = this.selectCurrentFile.bind(this);
        this.handleCloseOverwriteDialog = this.handleCloseOverwriteDialog.bind(this);
        this.handleCloseConflictDialog = this.handleCloseConflictDialog.bind(this);
        this.overwriteAll = this.overwriteAll.bind(this);
        this.skipAll = this.skipAll.bind(this);
        this.handleCancelOverwriteDialog = this.handleCancelOverwriteDialog.bind(this);
        this.showPopUpOverrideConfirmation = this.showPopUpOverrideConfirmation.bind(this);
        this.handleOneConflict = this.handleOneConflict.bind(this);
        this.handleMoreConflicts = this.handleMoreConflicts.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        LoadedFilesTab.saver = new MultiSave(this.props.reducer, this.handleOneConflict, this.handleMoreConflicts);
    }

    public componentWillReceiveProps(nextProps: LoadedFilesTabProps) {
        this.setState({
            checkedCheckboxes: nextProps.initialCheckedCheckboxes
        });
    }

    public componentDidMount() {
        this.setState({
            checkedCheckboxes: this.props.selectedFiles.length === 0 ? 0 : this.state.checkedCheckboxes
        });

        this.props.reducer.state$.subscribe(state => {
            let menuUtil = new NavigationMenuUtil(state);
            let newMenu = menuUtil.getActualMenu();

            let newCompareItem = this.state.comparePalleteItem;
            newCompareItem.text = newMenu.compareItem.text;
            newCompareItem.disabled = newMenu.compareItem.disabled;

            let newExportItem = this.state.exportPalleteItem;
            newExportItem.text = newMenu.exportItem.text;
            newExportItem.disabled = newMenu.exportItem.disabled;

            let newSaveItem = this.state.savePalleteItem;
            newSaveItem.text = newMenu.saveItem.text;
            newSaveItem.disabled = newMenu.saveItem.disabled;

            let newUnloadItem = this.state.unloadPalleteItem;
            newUnloadItem.text = newMenu.unloadItem.text;
            newUnloadItem.disabled = newMenu.unloadItem.disabled;

            this.setState({
                comparePalleteItem: newCompareItem,
                exportPalleteItem: newExportItem,
                savePalleteItem: newSaveItem,
                unloadPalleteItem: newUnloadItem
            });
        });
    }

    render() {
        return (
            <div className={this.props.className}>
                <List style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                    {this.props.loadedFiles.map((item, index) => {
                        const checked = this.isChecked(item);
                        const color = this.getColor(item);

                        return (
                            <ElementOfSelectableList
                                reducer={this.props.reducer}
                                key={index}
                                item={item}
                                selectFunction={this.selectCurrentFile}
                                colorDictionary={this.props.colorDictionary}
                                checked={checked}
                                color={color}
                                checkInform={this.changeNumberOfCheckedBoxes}
                            />
                        );
                    })}
                </List>
                {this.renderPalleteButton()}

                <ExportDialog
                    reducer={this.props.reducer}
                    handleClosePopUpDialog={this.handleCloseExportDialog}
                    openedPopUpDialog={this.state.openExportDialog}
                />
                <OverridePopUpDialog
                    reducer={this.props.reducer}
                    saveFile={LoadedFilesTab.saver.saveFile}
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
            </div>
        );
    }

    public handleSaveClick() {
        LoadedFilesTab.saver.handleSaveClick(this.state.savePalleteItem.disabled);
    }

    public handleCompareClick() {
        this.props.reducer.setComparisonActive(true);
        storeSelectedCompareFilesToDB(
            this.props.reducer.getState().selectedFiles[0],
            this.props.reducer.getState().selectedFiles[1]);
        storeComparisonActive(true);
    }

    private isChecked(file: HeavyweightFile) {
        const ll = this.props.selectedFiles.length;
        for (let i = 0; i < ll; i++) {
            const item = this.props.selectedFiles[i];
            if (item.selectedFile.fileName === file.fileName) {
                return true;
            }
        }
        return false;
    }

    private getColor(file: HeavyweightFile) {
        const ll = this.props.selectedFiles.length;
        for (let i = 0; i < ll; i++) {
            const item = this.props.selectedFiles[i];
            if (item.selectedFile.fileName === file.fileName) {
                return item.colour;
            }
        }
        return 'black';
    }

    private selectCurrentFile(file: HeavyweightFile) {
        this.props.reducer.removeAllSelectedFiles();
        this.props.reducer.setComparisonActive(false);
        this.props.colorDictionary.reset();
        this.props.reducer.updateCurrentFile(file);
        this.setState({
            checkedCheckboxes: 0
        });
        // db needs to update the currently selected file
        switchCurrentLoadedFile(file);
        storeComparisonActive(false);
        deleteAllSelectedFilesFromDB(this.props.reducer);
    }

    private changeNumberOfCheckedBoxes(addition: boolean) {

        if (addition) {
            this.setState({ checkedCheckboxes: this.state.checkedCheckboxes + 1 });
        } else {
            let checked = this.state.checkedCheckboxes - 1;
            this.setState({ checkedCheckboxes: checked });
            if (checked === 2) {
                this.props.reducer.changeColors(this.props.colorDictionary.getFirstFreeColor());
                this.props.reducer.changeColors(this.props.colorDictionary.getFirstFreeColor());
            }
        }
    }

    private renderPalleteButton(): JSX.Element {
        return (
            <div className="compare-button">
                <PalleteButtonMenu
                    items={[
                        this.state.exportPalleteItem,
                        this.state.savePalleteItem,
                        this.state.comparePalleteItem,
                        this.state.unloadPalleteItem
                    ]}
                    currentAction={this.props.reducer.getState().palleteMenuAction}
                    storeCurrentAction={(item: PalleteItem) => {
                        this.props.reducer.getState().palleteMenuAction = item;
                    }}
                />
            </div>

        );
    }

    private handleCloseExportDialog() {
        this.setState({
            openExportDialog: false
        });
    }

    private handleOpenExportDialog() {
        this.setState({
            openExportDialog: true
        });
    }

    private handleUnloadFiles() {
        let filesToUnload = this.props.reducer.getSelectedFiles();
        if (filesToUnload.length === 0) {
            let current = this.props.reducer.getState().currentFile;

            if (current) {
                filesToUnload = [current];
            }
        }
        this.props.reducer.getState().selectedFiles.forEach(file => {
            this.props.colorDictionary.freeColor(file.colour);
        });
        this.props.reducer.removeLoadedFiles(filesToUnload);
        this.props.reducer.setComparisonActive(false);
        deleteAllSelectedFilesFromDB(this.props.reducer);
        filesToUnload.forEach(file => {
            deleteFileFromLoaded(file, this.props.reducer);
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

    private handleCloseOverwriteDialog() {
        this.setState({
            openedOverrideDialog: false,
            conflictFiles: []
        });
    }

    private handleCloseConflictDialog() {
        this.setState({
            openedConflictDialog: false,
        });
    }

    private overwriteAll() {
        this.state.conflictFiles.forEach(file => {
            LoadedFilesTab.saver.saveFile(file);
        });
    }

    private skipAll() {
        this.setState({
            conflictFiles: []
        });
    }

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
}