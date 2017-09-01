import * as React from 'react';
import { DicomSimpleTable } from './dicom-table/dicom-simple-table';
import { TableMode } from '../model/table-enum';
import { HeavyweightFile, SelectedFile } from '../model/file-interfaces';
import { DicomExtendedTable } from './dicom-table/dicom-extended-table';
import {
    convertSimpleDicomToExtended,
    convertSimpleDicomToExtendedComparison,
    filterRedundantModulesBySopClass,
    filterRedundantCompareModulesBySopClass
} from '../utils/dicom-entry-converter';
import {
    DicomSimpleData,
    DicomSimpleComparisonData,
    DicomExtendedData,
    DicomExtendedComparisonData,
    DicomEntry
} from '../model/dicom-entry';
import { compareTwoFiles, areFilesExactlySame } from '../utils/dicom-comparator';
import { ApplicationStateReducer } from '../application-state';
import { DicomSimpleComparisonTable } from './dicom-table/dicom-simple-comparison-table';
import { DicomExtendedComparisonTable } from './dicom-table/dicom-extended-comparison-table';
import { FileSearcher } from '../utils/file-searcher';
import { DicomReader } from '../utils/dicom-reader';
import { Toggle, RaisedButton } from 'material-ui';
import { applyChangesForDisplay, EditUtil } from '../utils/edit-util';
import { ContentAddBox } from 'material-ui/svg-icons';
import { AddTagDialog } from './add-tag-dialog';
import { ChangeType } from '../model/edit-interface';

var isEqual = require('lodash.isequal');

interface TagViewerProps {
    tableMode: TableMode;
    files: SelectedFile[];
    currentFile: HeavyweightFile;
    comparisonActive: boolean;
    reducer: ApplicationStateReducer;
}

interface TagViewerState {
    showOnlyDiffs: boolean;
    exactlySameFiles: boolean;
    addTagDialogOpen: boolean;
}

export default class TagViewer extends React.Component<TagViewerProps, TagViewerState> {
    private fileSearcher: FileSearcher;

    public constructor(props: TagViewerProps) {
        super(props);
        this.fileSearcher = new FileSearcher(this.props.reducer);
        this.showOnlyDiffsOn = this.showOnlyDiffsOn.bind(this);
        this.state = {
            showOnlyDiffs: true,
            exactlySameFiles: false,
            addTagDialogOpen: false
        };

        this.handleAddNewEntry = this.handleAddNewEntry.bind(this);
    }

    public componentWillReceiveProps(nextProps: TagViewerProps) {
        let simpleComparisonData: DicomSimpleComparisonData = { dicomComparisonData: [] };

        if (nextProps.comparisonActive) {
            if (nextProps.files[0] && nextProps.files[1]) {
                simpleComparisonData = compareTwoFiles(
                    nextProps.files[0].selectedFile.dicomData.entries,
                    nextProps.files[0].colour,
                    nextProps.files[1].selectedFile.dicomData.entries,
                    nextProps.files[1].colour
                );

            }
            if (areFilesExactlySame(simpleComparisonData.dicomComparisonData)) {
                this.setState({
                    exactlySameFiles: true,
                    showOnlyDiffs: true
                });
            } else {
                this.setState({
                    exactlySameFiles: false,
                    showOnlyDiffs: true
                });
            }
        }
    }

    render() {
        let reader = new DicomReader();
        let data: DicomSimpleData = this.props.currentFile.dicomData;
        let sopClass = reader.getSopClassFromParsedDicom(data);
        
        let simpleComparisonData: DicomSimpleComparisonData = { dicomComparisonData: [] };

        if (this.props.comparisonActive) {
            if (this.props.files[0] && this.props.files[1]) {
                simpleComparisonData = compareTwoFiles(
                    this.props.files[0].selectedFile.dicomData.entries,
                    this.props.files[0].colour,
                    this.props.files[1].selectedFile.dicomData.entries,
                    this.props.files[1].colour
                );
            }

            if (this.props.reducer.getState().searchExpression !== '') {
                simpleComparisonData = this.fileSearcher.searchCompareData(simpleComparisonData.dicomComparisonData);
            }
        } else {
            if (this.props.reducer.getState().searchExpression !== '') {
                data = this.fileSearcher.searchFile();
            }
        }

        data = applyChangesForDisplay(this.props.currentFile, data);
        let table: JSX.Element;
        switch (this.props.tableMode) {
            case TableMode.SIMPLE:
                if (this.props.comparisonActive) {
                    table = this.renderSimpleComparisonTable(simpleComparisonData);
                } else {
                    table = this.renderSimpleTable(data);
                }
                break;
            case TableMode.EXTENDED:
                if (this.props.comparisonActive) {
                    table = this.renderExtendedComparisonTable(simpleComparisonData, sopClass);
                } else {
                    table = this.renderExtendedTable(data, sopClass);
                }
                break;
            default:
                table = (
                    <div />
                );
        }

        return (
            <div>
                <RaisedButton
                    label={'add tag'}
                    icon={<ContentAddBox />}
                    primary={true}
                    style={{marginBottom: '15px'}}
                    onClick={() => {
                        this.setState({
                            addTagDialogOpen: true
                        });
                    }}
                />
                {table}
                <AddTagDialog
                    handleClosePopUpDialog={() => this.setState({
                        addTagDialogOpen: false
                    })}
                    handleCancelPopUpDialog={() => this.setState({
                        addTagDialogOpen: false
                    })}
                    handleAction={this.handleAddNewEntry}
                    openedPopUpDialog={this.state.addTagDialogOpen}
                />
            </div>
        );
    }

    private handleAddNewEntry(newEntry: DicomEntry) {
        let editUtil: EditUtil = new EditUtil(this.props.reducer);
        editUtil.applyChangeToCurrentFile(newEntry, ChangeType.ADD);
        this.setState({
            addTagDialogOpen: false
        });
    }

    private renderSimpleTable(data: DicomSimpleData): JSX.Element {
        return data.entries.length >= 1 ? (
            <div>
                <DicomSimpleTable entries={data.entries} reducer={this.props.reducer} />
            </div>
        ) : (<div />);
    }

    private renderExtendedTable(data: DicomSimpleData, sopClass: string | undefined): JSX.Element {
        let filtered: DicomExtendedData = {};

        if (sopClass) {
            filtered = filterRedundantModulesBySopClass(convertSimpleDicomToExtended(data), sopClass);
        }

        return (!isEqual(filtered, {})) ? (
            <div>
                <DicomExtendedTable data={filtered} reducer={this.props.reducer} />
            </div>
        ) : (<div>No data to display or no modules found for SOP class: {sopClass ? sopClass : 'Undefined'}</ div>);
    }

    private renderSimpleComparisonTable(data: DicomSimpleComparisonData): JSX.Element {
        return (this.state.exactlySameFiles) ? (
            <div>
                <Toggle
                    label="show only differences"
                    defaultToggled={true}
                    onToggle={this.showOnlyDiffsOn}
                    labelPosition="right"
                    style={{ margin: 20 }}
                />
                <h3 className="file-name-h1">
                    Files are exactly the same
                </h3>
                <DicomSimpleComparisonTable
                    comparisonData={data.dicomComparisonData}
                    showOnlyDiffs={this.state.showOnlyDiffs}
                />
            </div>
        )
            : (
                <div>
                    <Toggle
                        label="show only differences"
                        defaultToggled={true}
                        onToggle={this.showOnlyDiffsOn}
                        labelPosition="right"
                        style={{ margin: 20 }}
                    />
                    <DicomSimpleComparisonTable
                        comparisonData={data.dicomComparisonData}
                        showOnlyDiffs={this.state.showOnlyDiffs}
                    />
                </div>
            );
    }

    private renderExtendedComparisonTable(data: DicomSimpleComparisonData, sopClass: string | undefined): JSX.Element {
        let filtered: DicomExtendedComparisonData = {};

        if (sopClass) {
            filtered = filterRedundantCompareModulesBySopClass(convertSimpleDicomToExtendedComparison(data), sopClass);
        }

        return (!isEqual(filtered, {})) ? (
            (this.state.exactlySameFiles) ? (
                <div>
                    <Toggle
                        label="show only differences"
                        defaultToggled={true}
                        onToggle={this.showOnlyDiffsOn}
                        labelPosition="right"
                        style={{ margin: 20 }}
                    />
                    <h3 className="file-name-h1">
                        Files are exactly the same
                </h3>
                    <DicomExtendedComparisonTable
                        data={filtered}
                        showOnlyDiffs={this.state.showOnlyDiffs}
                    />
                </div>
            )
                : (
                    <div>
                        <Toggle
                            label="show only differences"
                            defaultToggled={true}
                            onToggle={this.showOnlyDiffsOn}
                            labelPosition="right"
                            style={{ margin: 20 }}
                        />
                        <DicomExtendedComparisonTable
                            data={filtered}
                            showOnlyDiffs={this.state.showOnlyDiffs}
                        />
                    </div>
                )
        ) : (<div>No data to display or no modules found for SOP class: {sopClass ? sopClass : 'Undefined'}</ div>);

    }

    private showOnlyDiffsOn() {
        if (this.state.showOnlyDiffs) {
            this.setState({
                showOnlyDiffs: false
            });
        } else {
            this.setState({
                showOnlyDiffs: true
            });
        }

    }
}