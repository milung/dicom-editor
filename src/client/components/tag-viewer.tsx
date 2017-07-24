import * as React from 'react';
import './tag-viewer.css';
import { DicomExtendedTable } from './dicom-table/dicom-extended-table';
import { DicomExtendedData } from '../model/dicom-entry';

interface TagViewerProps {
  data: DicomExtendedData;
}

interface TagViewerState {

}

export default class TagViewer extends React.Component<TagViewerProps, TagViewerState> {

    public constructor(props: TagViewerProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>TagViewer</h1>
                <DicomExtendedTable data={this.props.data} />
            </div>
        );
    }
}