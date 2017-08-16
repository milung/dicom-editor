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

interface LoadedFilesTabProps {
    reducer: ApplicationStateReducer;
    loadedFiles: HeavyweightFile[];
    selectedFiles: SelectedFile[];
    colorDictionary: ColorDictionary;
    className: string;
}

interface LoadedFilesTabState {
    checkedCheckboxes: number;
    comparePalleteItem: PalleteItem;
    exportPalleteItem: PalleteItem;
    savePalleteItem: PalleteItem;
    unloadPalleteItem: PalleteItem;
    openExportDialog: boolean;
}

/* tslint:disable */
export default class LoadedFilesTab extends React.Component<LoadedFilesTabProps, LoadedFilesTabState> {
    constructor(props: LoadedFilesTabProps) {
        super(props);
        this.state = {
            checkedCheckboxes: 0,
            openExportDialog: false,

            comparePalleteItem: {
                text: 'Compare files',
                onClick: () => { this.handleCompareClick(); },
                icon: (<ActionCompareArrows />),
                disabled: true
            },

            exportPalleteItem: {
                text: 'Export file',
                onClick: () => { this.handleOpenExportDialog() },
                icon: (<FileFileDownload />),
                disabled: true
            },

            savePalleteItem: {
                text: 'Save file',
                onClick: () => { },
                icon: (<ContentSave />),
                disabled: true
            },

            unloadPalleteItem: {
                text: 'Unload file',
                onClick: () => { this.handleUnloadFiles() },
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
            </div>
        );
    }

    public handleCompareClick() {
        this.props.reducer.setComparisonActive(true);
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
    }

    private changeNumberOfCheckedBoxes(addition: boolean) {
        if (addition) {
            this.setState({ checkedCheckboxes: this.state.checkedCheckboxes + 1 });
        } else {
            let checked = this.state.checkedCheckboxes - 1;
            this.setState({ checkedCheckboxes: checked });
            if (checked === 2) {
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
        this.props.reducer.removeLoadedFiles(this.props.reducer.getSelectedFiles());
    }
}