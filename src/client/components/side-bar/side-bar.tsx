import * as React from 'react';

import Paper from 'material-ui/Paper';
import { List } from 'material-ui/List';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';

import { ApplicationStateReducer, SelectedFile } from '../../application-state';
import { HeavyweightFile, LightweightFile } from '../../model/file-interfaces';
import { ElementOfSelectableList } from './element-selectable-list';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './side-bar.css';
import { ListItem } from 'material-ui';
import TabTemplate from '.././tab-template';
import { ElementOfDeletableList } from './element-deletable-list';
import {
    isFileSavedInDb,
    saveFileIntoSavedDb,
    convertHeavyToLight,
    deleteFileFromSaved,
    loadSavedFiles
} from '../../utils/file-store-util';
import { OverrideDialog } from './override-dialog';

export interface SideBarProps {
    reducer: ApplicationStateReducer;
}

export interface SideBarState {
    loadedFiles: HeavyweightFile[];
    recentFiles: LightweightFile[];
    selectedFiles: SelectedFile[];
    checkedCheckboxes: number;
    savedFiles: LightweightFile[];
    openedOverrideDialog: boolean;
}

export default class SideBar extends React.Component<SideBarProps, SideBarState> {
    private colorDictionary: ColorDictionary;

    public constructor(props: SideBarProps) {
        super(props);

        this.state = {
            loadedFiles: [],
            recentFiles: [],
            selectedFiles: [],
            checkedCheckboxes: 0,
            savedFiles: [],
            openedOverrideDialog: false
        };

        this.colorDictionary = new ColorDictionary();
        this.selectCurrentFile = this.selectCurrentFile.bind(this);
        this.selectCurrentFileFromRecentFile = this.selectCurrentFileFromRecentFile.bind(this);
        this.handleCompareClick = this.handleCompareClick.bind(this);
        this.changeNumberOfCheckedBoxes = this.changeNumberOfCheckedBoxes.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleCloseOverrideDialog = this.handleCloseOverrideDialog.bind(this);
        this.showPopUpOverrideConfirmation = this.showPopUpOverrideConfirmation.bind(this);
        this.handleOverrideButton = this.handleOverrideButton.bind(this);
        this.saveFile = this.saveFile.bind(this);
    }

    public componentDidMount() {
        this.props.reducer.state$.subscribe(state => {
            this.setState({
                loadedFiles: state.loadedFiles,
                recentFiles: state.recentFiles,
                selectedFiles: state.selectedFiles,
                checkedCheckboxes: state.selectedFiles.length === 0 ? 0 : this.state.checkedCheckboxes,
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
                        <List style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                            {this.state.loadedFiles.map((item, index) => {
                                const checked = this.isChecked(item);
                                const color = this.getColor(item);

                                return (
                                    <ElementOfSelectableList
                                        reducer={this.props.reducer}
                                        key={index}
                                        item={item}
                                        selectFunction={this.selectCurrentFile}
                                        colorDictionary={this.colorDictionary}
                                        checked={checked}
                                        color={color}
                                        checkInform={this.changeNumberOfCheckedBoxes}
                                        checkBoxDisabled={this.state.checkedCheckboxes === 2 ? true : false}
                                    />
                                );
                            })}
                        </List>
                        <RaisedButton
                            className="compare-button"
                            label="Compare files"
                            onClick={this.handleCompareClick}
                            primary={true}
                            disabled={this.state.selectedFiles.length === 2 ? false : true}
                        />
                    </Tab>
                    <Tab label="Recent">
                        <List>
                            {this.state.recentFiles.map((item, index) => (
                                <ListItem
                                    key={index}
                                    onClick={() => this.selectCurrentFileFromRecentFile(item)}
                                    primaryText={item.fileName}
                                />
                            ))}
                        </List>
                    </Tab>
                    <Tab label="Saved">
                        <List style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                            {this.state.savedFiles.map((item, index) => {

                                return (
                                    <ElementOfDeletableList
                                        key={index}
                                        lightFile={item}
                                        deleteFunction={this.handleDeleteClick}
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
                    </Tab>
                </Tabs>
                <OverrideDialog
                    handleCloseOverrideDialog={this.handleCloseOverrideDialog}
                    handleOverrideButton={this.handleOverrideButton}
                    openedOverrideDialog={this.state.openedOverrideDialog}
                />
            </Paper>
        );
    }

    public async handleSaveClick() {
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

    public handleDeleteClick(lightFile: LightweightFile) {
        deleteFileFromSaved(lightFile);
        loadSavedFiles(this.props.reducer);
    }

    public handleCompareClick(event: object) {
        this.props.reducer.setComparisonActive(true);
    }

    /**
     * @description Displays pop up window to ask user if file should be overriden.
     */
    private showPopUpOverrideConfirmation() {
        this.setState({
            openedOverrideDialog: true
        });
    }

    /**
     * @description Saves file into both DB and app state
     * @param {HeavyweightFile} file file to save
     */
    private saveFile(file: HeavyweightFile) {
        let lightFile = convertHeavyToLight(file);
        saveFileIntoSavedDb(file);
        this.props.reducer.addSavedFile(lightFile);
    }

    private handleCloseOverrideDialog() {
        this.setState({
            openedOverrideDialog: false
        });
    }

    private handleOverrideButton() {
        let file = this.props.reducer.getState().currentFile;
        if (file) {
            this.saveFile(file);
        }

        this.handleCloseOverrideDialog();
    }

    private selectCurrentFile(file: HeavyweightFile) {
        this.props.reducer.removeAllSelectedFiles();
        this.props.reducer.setComparisonActive(false);
        this.colorDictionary.reset();
        this.props.reducer.updateCurrentFile(file);
    }

    private selectCurrentFileFromRecentFile(file: LightweightFile) {
        this.props.reducer.removeAllSelectedFiles();
        this.props.reducer.setComparisonActive(false);
        this.colorDictionary.reset();
        this.props.reducer.updateCurrentFromRecentFile(file);
    }

    private isChecked(file: HeavyweightFile) {
        const ll = this.state.selectedFiles.length;
        for (let i = 0; i < ll; i++) {
            const item = this.state.selectedFiles[i];
            if (item.selectedFile.fileName === file.fileName) {
                return true;
            }
        }

        return false;
    }

    private getColor(file: HeavyweightFile) {
        const ll = this.state.selectedFiles.length;
        for (let i = 0; i < ll; i++) {
            const item = this.state.selectedFiles[i];
            if (item.selectedFile.fileName === file.fileName) {
                return item.colour;
            }
        }

        return 'black';
    }

    private changeNumberOfCheckedBoxes(addition: boolean) {
        if (addition) {
            this.setState({ checkedCheckboxes: this.state.checkedCheckboxes + 1 });
        } else {
            this.setState({ checkedCheckboxes: this.state.checkedCheckboxes - 1 });
        }
    }
}
