import * as React from 'react';
import './tag-viewer.css';
import { DicomSimpleTable } from './dicom-table/dicom-simple-table';
import { TableMode } from '../model/table-enum';
import { HeavyweightFile } from '../model/file-interfaces';
import { DicomExtendedTable } from './dicom-table/dicom-extended-table';
import { convertSimpleDicomToExtended, convertSimpleDicomToExtendedComparison } from '../utils/dicom-entry-converter';
import { DicomSimpleData, DicomSimpleComparisonData } from '../model/dicom-entry';
import { compareTwoFiles } from '../utils/dicom-comparator';
import { SelectedFile } from '../application-state';
import { DicomSimpleComparisonTable } from './dicom-table/dicom-simple-comparison-table';
import { DicomExtendedComparisonTable } from './dicom-table/dicom-extended-comparison-table';

interface TagViewerProps {
    tableMode: TableMode;
    files: SelectedFile[];
    currentFile: HeavyweightFile;
    comparisonActive: boolean;
}

interface TagViewerState {

}

export default class TagViewer extends React.Component<TagViewerProps, TagViewerState> {

    public constructor(props: TagViewerProps) {
        super(props);
    }

    render() {
        let data: DicomSimpleData = { entries: [] };
        let simpleComparisonData: DicomSimpleComparisonData = { dicomComparisonData: []};

        if (this.props.comparisonActive) {
            if (this.props.files[0] && this.props.files[1]) {
                // data = compareTwoFiles(this.props.files[0], this.props.files[1]);
                simpleComparisonData = compareTwoFiles(this.props.files[0], this.props.files[1]);
            }
        } else {
            data = this.props.currentFile.dicomData;
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

        return data.entries.length > 1 ? (
            <div>
                <DicomSimpleTable entries={data.entries} />
            </div>
        ) : (<div/>);
        
    }

    private renderExtendedTable(data: DicomSimpleData): JSX.Element {
        return (
            <div>
                <DicomExtendedTable data={convertSimpleDicomToExtended(data)} />
            </div>
        );
    }

    private renderSimpleComparisonTable(data: DicomSimpleComparisonData): JSX.Element {
        return (
            <div>
                <DicomSimpleComparisonTable comparisonData={data.dicomComparisonData} />
            </div>
        );
    }

    private renderExtendedComparisonTable(data: DicomSimpleComparisonData): JSX.Element {
        return (
            <div>
                <DicomExtendedComparisonTable data={convertSimpleDicomToExtendedComparison(data)} />
            </div>
        );
    }
}