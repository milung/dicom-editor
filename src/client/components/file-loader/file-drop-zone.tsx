import * as React from 'react';
import * as Dropzone from 'react-dropzone';

import { ApplicationStateReducer } from '../../application-state';
import FileService from './file-service';

import './file-drop-zone.css';

interface FileDropZoneProps {
    reducer: ApplicationStateReducer;
}

interface FileDropZoneState {

}

export default class FileDropZone extends React.Component<FileDropZoneProps, FileDropZoneState> {
    fileService: FileService;
    constructor(props: FileDropZoneProps) {
        super(props);
        this.fileService = new FileService(this.props.reducer);
    }

    onDrop(files: File[]) {
        this.fileService.loadFiles(files);     
    }

    render() {       
        return (
            <Dropzone
                disableClick={true}
                disablePreview={true}
                className="dropzoneHandler"
                onDrop={this.onDrop.bind(this)}
            />
        );
    }
}
