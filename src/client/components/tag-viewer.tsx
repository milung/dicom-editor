import * as React from 'react';
import './tag-viewer.css';
import { DicomSimpleTable } from "./dicom-table/dicom-simple-table";
import { TableType } from "../model/table-enum";
import { HeavyweightFile } from "../model/file-interfaces";
import { DicomExtendedTable } from "./dicom-table/dicom-extended-table";

interface TagViewerProps {
    tableType: TableType;
    files: HeavyweightFile[];

}

interface TagViewerState {

}

export default class TagViewer extends React.Component<TagViewerProps, TagViewerState> {

    public constructor(props: TagViewerProps) {
        super(props);
    }

    render() {
        switch (this.props.tableType) {
            case TableType.SIMPLE:
                return this.renderSimpleTable();
            case TableType.EXTENDED:
                return this.renderExtendedTable();
            case TableType.SIMPLE_COMPARISON:
                return this.renderSimpleComparisonTable();
            case TableType.EXTENDED_COMPARISON:
                return this.renderExtendedComparisonTable();
            default:
                return (
                    <div />
                );
        }
    }

    private renderSimpleTable(): JSX.Element {
        return (
            <div>
                <h1>TagViewer</h1>
                <DicomSimpleTable entries={[]} />
            </div>
        );
    }

    private renderExtendedTable(): JSX.Element {
        return (
            <div>
                <h1>TagViewer</h1>
                <DicomExtendedTable data={{}} />
            </div>
        );
    }

    private renderSimpleComparisonTable(): JSX.Element {
        return (
            <div/>
        );
    }

    private renderExtendedComparisonTable(): JSX.Element {
        return (
            <div/>
        );
    }
}