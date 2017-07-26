import * as React from 'react';
import './tag-viewer.css';
import { DicomSimpleTable } from './dicom-table/dicom-simple-table';
import { TableMode } from '../model/table-enum';
import { HeavyweightFile } from '../model/file-interfaces';
import { DicomExtendedTable } from './dicom-table/dicom-extended-table';
import { convertSimpleDicomToExtended } from '../utils/dicom-entry-converter';

interface TagViewerProps {
    tableType: TableMode;
    files: HeavyweightFile[];
    currentFile: HeavyweightFile;
}

interface TagViewerState {

}

export default class TagViewer extends React.Component<TagViewerProps, TagViewerState> {

    public constructor(props: TagViewerProps) {
        super(props);
    }

    render() {
        // let data: DicomSimpleData = {entries: []};
        // if(this.props.files[0] && this.props.files[1]){
        //     data = 
        // compareTwoFiles(this.props.files[0].dicomData.entries, 3, this.props.files[1].dicomData.entries, 4);
        // }
        if (this.props.files.length > 0) {
            switch (this.props.tableType) {
                case TableMode.SIMPLE:
                    return this.renderSimpleTable();
                case TableMode.EXTENDED:
                    return this.renderExtendedTable();
                case TableMode.SIMPLE_COMPARISON:
                    return this.renderSimpleComparisonTable();
                case TableMode.EXTENDED_COMPARISON:
                    return this.renderExtendedComparisonTable();
                default:
                    return (
                        <div />
                    );
            }
        } else {
            return <div/>;
        }
    }

    private renderSimpleTable(): JSX.Element {
        return (
            <div>
                <DicomSimpleTable entries={this.props.currentFile.dicomData.entries} />
            </div>
        );
    }

    private renderExtendedTable(): JSX.Element {
        return (
            <div>
                <DicomExtendedTable data={convertSimpleDicomToExtended(this.props.currentFile.dicomData)} />
            </div>
        );
    }

    private renderSimpleComparisonTable(): JSX.Element {
        return (
            <div />
        );
    }

    private renderExtendedComparisonTable(): JSX.Element {
        return (
            <div />
        );
    }
}