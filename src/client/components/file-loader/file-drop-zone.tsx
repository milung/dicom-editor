import * as React from 'react';
import * as Dropzone from 'react-dropzone';

import { ApplicationStateReducer } from '../../application-state';
import { FileService } from './file-service';

import './file-drop-zone.css';
import { storeFilesToDB } from '../../utils/loaded-files-store-util';

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
        this.onDrop = this.onDrop.bind(this); 
    }

    onDrop(files: File[]) {
        if (files.length > 0) {
            this.fileService.loadFiles(files).then( () => {
               storeFilesToDB(this.props.reducer); 
            });  
            
        }
    }

    render() {       
        return (
            <Dropzone
                disableClick={true}
                disablePreview={true}
                className="dropzoneHandler"
                onDrop={this.onDrop}
            >
            {this.props.children}
            </Dropzone>
        );
    }
}
