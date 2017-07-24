import * as React from 'react';
import './tag-viewer.css';
import { DicomExtendedTable } from './dicom-table/dicom-extended-table';
import { DicomSimpleTable } from './dicom-table/dicom-simple-table';
import { DicomSimpleData } from '../model/dicom-entry';
import { convertSimpleDicomToExtended } from "../utils/dicom-entry-converter";
import { TABLE_MODE_EXTENDED, TABLE_MODE_SIMPLE } from "../containers/main-view";

interface TagViewerProps {
    data: DicomSimpleData;
    tableMode: string;
}

interface TagViewerState {

}

export default class TagViewer extends React.Component<TagViewerProps, TagViewerState> {

    public constructor(props: TagViewerProps) {
        super(props);
    }



    render() {
        let component;
        switch (this.props.tableMode) {
            case (TABLE_MODE_EXTENDED):
                component = <DicomExtendedTable data={convertSimpleDicomToExtended(this.props.data)} />;
                break;
            case (TABLE_MODE_SIMPLE):
                component = <DicomSimpleTable entries={this.props.data.entries} />;
                break;
        }
        return (
            <div>
                <h1>TagViewer</h1>
                {component}
            </div>
        );
    }
}