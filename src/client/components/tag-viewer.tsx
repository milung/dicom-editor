import * as React from 'react';
import { DicomSimpleTable } from './dicom-table/dicom-simple-table';
import { TableMode } from '../model/table-enum';
import { HeavyweightFile, SelectedFile } from '../model/file-interfaces';
import { DicomExtendedTable } from './dicom-table/dicom-extended-table';
import {
    convertSimpleDicomToExtended,
    convertSimpleDicomToExtendedComparison,
    filterRedundantModulesBySopClass
} from '../utils/dicom-entry-converter';
import { DicomSimpleData, DicomSimpleComparisonData, DicomExtendedData } from '../model/dicom-entry';
import { compareTwoFiles } from '../utils/dicom-comparator';
import { ApplicationStateReducer } from '../application-state';
import { DicomSimpleComparisonTable } from './dicom-table/dicom-simple-comparison-table';
import { DicomExtendedComparisonTable } from './dicom-table/dicom-extended-comparison-table';
import { FileSearcher } from '../utils/file-searcher';
import { DicomReader } from '../utils/dicom-reader';
import * as lodash from 'lodash';
import { Toggle } from 'material-ui';

interface TagViewerProps {
    tableMode: TableMode;
    files: SelectedFile[];
    currentFile: HeavyweightFile;
    comparisonActive: boolean;
    reducer: ApplicationStateReducer;
}

interface TagViewerState {
    showOnlyDiffs: boolean;
}

export default class TagViewer extends React.Component<TagViewerProps, TagViewerState> {
    private fileSearcher: FileSearcher;

    public constructor(props: TagViewerProps) {
        super(props);
        this.fileSearcher = new FileSearcher(this.props.reducer);
        this.showOnlyDiffsOn = this.showOnlyDiffsOn.bind(this);
        this.state = {
            showOnlyDiffs: false
        };
    }

    render() {
        let data: DicomSimpleData = this.props.currentFile.dicomData;
        let simpleComparisonData: DicomSimpleComparisonData = { dicomComparisonData: [] };

        if (this.props.comparisonActive) {
            if (this.props.files[0] && this.props.files[1]) {
                simpleComparisonData = compareTwoFiles(this.props.files[0], this.props.files[1]);
            }

            if (this.props.reducer.getState().searchExpression !== '') {
                simpleComparisonData = this.fileSearcher.searchCompareData(simpleComparisonData.dicomComparisonData);
            }
        } else {
            if (this.props.reducer.getState().searchExpression !== '') {
                data = this.fileSearcher.searchFile();
            }
        }

        switch (this.props.tableMode) {
            case TableMode.SIMPLE:
                if (this.props.comparisonActive) {
                    return this.renderSimpleComparisonTable(simpleComparisonData);
                } else {
                    return this.renderSimpleTable(data);
                }

            case TableMode.EXTENDED:
                if (this.props.comparisonActive) {
                    return this.renderExtendedComparisonTable(simpleComparisonData);
                } else {
                    return this.renderExtendedTable(data);
                }
            default:
                return (
                    <div />
                );
        }
    }

    private renderSimpleTable(data: DicomSimpleData): JSX.Element {

        return data.entries.length >= 1 ? (
            <div>
                <DicomSimpleTable entries={data.entries} />
            </div>
        ) : (<div />);

    }

    private renderExtendedTable(data: DicomSimpleData): JSX.Element {
        let reader = new DicomReader();
        let sopClass = reader.getSopClassFromParsedDicom(data);

        let filtered: DicomExtendedData = {};

        if (sopClass) {
            filtered = filterRedundantModulesBySopClass(convertSimpleDicomToExtended(data), sopClass);
        }

        return (!lodash.isEqual(filtered, {})) ? (
            <div>
                <DicomExtendedTable data={filtered} />
            </div>
        ) : (<div>No data to display or no modules found for SOP class: {sopClass}</ div>);
    }

    private renderSimpleComparisonTable(data: DicomSimpleComparisonData): JSX.Element {
        return (
            <div>
                <Toggle
                    label="show only differences"
                    defaultToggled={false}
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

    private renderExtendedComparisonTable(data: DicomSimpleComparisonData): JSX.Element {
        return (
            <div>
                <Toggle
                    label="show only differences"
                    defaultToggled={false}
                    onToggle={this.showOnlyDiffsOn}
                    labelPosition="right"
                    style={{ margin: 20 }}
                />
                <DicomExtendedComparisonTable
                    data={convertSimpleDicomToExtendedComparison(data)}
                    showOnlyDiffs={this.state.showOnlyDiffs}
                />
            </div>
        );
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