import * as React from 'react';
import { Dialog, FlatButton, Checkbox } from 'material-ui';
import { ApplicationStateReducer } from '../../application-state';
import { containsImage, isMultiframe } from '../../utils/dicom-validator';
import { ExportMetadata } from '../../model/export-interfaces';
import { download } from '../../utils/download-service';

export interface ExportDialogProps {
    reducer: ApplicationStateReducer;
    handleClosePopUpDialog: Function;
    openedPopUpDialog: boolean;
}

export interface ExportDialogState {
    exportImage: boolean;
    exportTags: boolean;
    multiframe: boolean;
    hasImage: boolean;
    isFileLoaded: boolean;
}

export class ExportDialog extends React.Component<ExportDialogProps, ExportDialogState> {

    private actions = [
        (
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => { this.props.handleClosePopUpDialog(); }}
            />
        ),
        (
            <FlatButton
                label="Export"
                primary={true}
                onTouchTap={() => { this.handleExport(); }}
            />
        ),
    ];
    
    constructor(props: ExportDialogProps) {
        super(props);
        this.state = {
            exportImage: false,
            exportTags: false,
            multiframe: false,
            hasImage: false,
            isFileLoaded: false
        };

    }

    public render() {
        return (
            <div>
                <Dialog
                    title={'Choose export options'}
                    actions={this.actions}
                    modal={false}
                    open={this.props.openedPopUpDialog}
                    onRequestClose={() => { this.props.handleClosePopUpDialog(); }}
                >

                    <Checkbox
                        label="Image"
                        onCheck={() => {
                            this.setState({ exportImage: !this.state.exportImage });
                        }}
                        checked={this.state.exportImage}
                        disabled={!this.state.hasImage}
                    />

                    <Checkbox
                        label="Tags"
                        onCheck={() => {
                            this.setState({ exportTags: !this.state.exportTags });
                        }}
                        checked={this.state.exportTags}
                        disabled={!this.state.isFileLoaded}
                    />

                </Dialog>
            </div>
        );
    }
    public componentWillReceiveProps(nextProps: ExportDialogProps) {
        if (nextProps.openedPopUpDialog) {
            let tempHeavy = this.props.reducer.getState().currentFile;
            let hasImage: boolean = false;
            let hasMultipleFrames: boolean = false;
            if (tempHeavy) {
                hasImage = containsImage(tempHeavy.dicomData);
                hasMultipleFrames = isMultiframe(tempHeavy.dicomData);
                this.setState({
                    multiframe: hasMultipleFrames,
                    hasImage: hasImage,
                    isFileLoaded: true
                });
            } else {
                this.setState({
                    isFileLoaded: false
                });
            }
        }

    }

    private handleExport() {

        let exportMetadata: ExportMetadata = {
            excel: this.state.exportTags,
            image: this.state.exportImage,
            multiframe: this.state.multiframe
        };
        this.dummyExport(exportMetadata);
    }

    private dummyExport(exportMetadata: ExportMetadata) {
        download(exportMetadata, this.props.reducer);
    }
}