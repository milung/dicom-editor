import * as React from 'react';
import './TagViewer.css';
import { DicomTable } from './dicom-table/dicom-table';
import { DicomData } from '../model/dicom-entry';

interface TagViewerProps {
  data: DicomData;
}

interface TagViewerState {

}

export default class TagViewer extends React.Component<TagViewerProps, TagViewerState> {
    render() {
        return (
            <div>
                <h1>TagViewer</h1>
                <DicomTable data={this.props.data}/>
            </div>
        );
    }
}