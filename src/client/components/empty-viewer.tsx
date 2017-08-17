import * as React from 'react';
import './empty-viewer.css';
import { RaisedButton } from 'material-ui';
import { FileService } from './file-loader/file-service';
import { ApplicationStateReducer } from '../application-state';

export interface EmptyViewerProps {
    reducer: ApplicationStateReducer;
}

export interface EmptyViewerState {

}

export class EmptyViewer extends React.Component<EmptyViewerProps, EmptyViewerState> {
    fileService: FileService;
    inputRef: HTMLInputElement | null;
    public constructor(props: EmptyViewerProps) {
        super(props);
        this.fileService = new FileService(this.props.reducer);
        this.selectFilesFromPC = this.selectFilesFromPC.bind(this);
    }

    public render() {
        return (
            <div className="empty-viewer-wrapper">
                <div className="empty-viewer-text">
                    <h1>No file loaded</h1>
                    <div>
                        Drag and drop a file here<br />
                        or choose from saved
                    </div>
                    <RaisedButton
                        containerElement="label"
                        label={'Load a file'}
                        primary={true}
                        className="select-file-btn"
                    >
                        <input
                            type="file"
                            ref={(ref) => this.inputRef = ref}
                            className="file-input"
                            accept=".dcm"
                            onChange={() => this.selectFilesFromPC()}
                            multiple={true}
                        />
                    </RaisedButton>
                </div>
            </div>
        );
    }

    private selectFilesFromPC() {
        let files: File[] = [];
        let input = this.inputRef;
        if (input) {
            if (input.files) {
                for (var i = 0; i < input.files.length; i++) {
                    files.push(input.files[i]);
                }
                this.fileService.loadFiles(files);
            }
        }
    }
}