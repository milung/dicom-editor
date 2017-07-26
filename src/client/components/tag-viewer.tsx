import * as React from 'react';
import './tag-viewer.css';
import { DicomSimpleTable } from './dicom-table/dicom-simple-table';
import { TableMode } from '../model/table-enum';
import { HeavyweightFile } from '../model/file-interfaces';
import { DicomExtendedTable } from './dicom-table/dicom-extended-table';
import { convertSimpleDicomToExtended } from '../utils/dicom-entry-converter';
import { DicomSimpleData } from '../model/dicom-entry';
import { compareTwoFiles } from '../utils/dicom-comparator';
import { SelectedFile } from '../application-state';

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

        if (this.props.comparisonActive) {
            if (this.props.files[0] && this.props.files[1]) {
                data = compareTwoFiles(this.props.files[0].selectedFile.dicomData.entries, 1,
                                       this.props.files[1].selectedFile.dicomData.entries, 2);
            }
        } else {
            data = this.props.currentFile.dicomData;
        }

        switch (this.props.tableMode) {
            case TableMode.SIMPLE:
                return this.renderSimpleTable(data);
            case TableMode.EXTENDED:
                return this.renderExtendedTable(data);
            default:
                return (
                    <div />
                );
        }
    }

    private renderSimpleTable(data: DicomSimpleData): JSX.Element {
        return (
            <div>
                <DicomSimpleTable entries={data.entries} />
            </div>
        );
    }

    private renderExtendedTable(data: DicomSimpleData): JSX.Element {
        return (
            <div>
                <DicomExtendedTable data={convertSimpleDicomToExtended(data)} />
            </div>
        );
    }
}