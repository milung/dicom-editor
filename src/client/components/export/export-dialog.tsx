import * as React from 'react';
import { Dialog, FlatButton, Checkbox } from 'material-ui';
import { ApplicationStateReducer } from '../../application-state';
import { containsImage, isMultiframe } from '../../utils/dicom-validator';
import { ExportMetadata } from '../../model/export-interfaces';
import { Downloader } from '../../utils/download-service';
import { HeavyweightFile } from '../../model/file-interfaces';
import { ProgresBarDialog } from '../progres-bar-dialog';

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
    openProgresDialog: boolean;
    currentFileIndex: number;
    exportActive: boolean;
}

export class ExportDialog extends React.Component<ExportDialogProps, ExportDialogState> {
    private numberOfFiles: number;
    private actions = [
        (
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => {
                    this.clearCheckBoxes(); this.props.handleClosePopUpDialog();
                }}

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
            exportActive: false,
            currentFileIndex: 0,
            exportImage: false,
            exportTags: false,
            multiframe: false,
            hasImage: false,
            isFileLoaded: false,
            openProgresDialog: false,
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
                <ProgresBarDialog
                    open={this.state.openProgresDialog}
                    maxValue={this.numberOfFiles}
                    currentValue={this.props.reducer.getState().curentExportFileNumber}
                    handleCloseDialog={() => { this.setState({ openProgresDialog: false }); }}
                />
            </div>
        );
    }
    public componentDidMount() {
        this.props.reducer.state$.subscribe(state => {
            let openProgres: boolean = false;
            if ((this.numberOfFiles !== state.curentExportFileNumber) && this.numberOfFiles > 0 
                &&  this.state.exportActive === true) {
                openProgres = true;
            }
            this.setState({
                currentFileIndex: state.curentExportFileNumber,
                openProgresDialog: openProgres
            });
        });
    }
    public componentWillReceiveProps(nextProps: ExportDialogProps) {
        if (nextProps.openedPopUpDialog) {
            let firstSelected = this.props.reducer.getState().selectedFiles[0];
            let tempHeavy: HeavyweightFile | undefined;
            this.numberOfFiles = this.props.reducer.getState().selectedFiles.length;

            if (firstSelected) {
                tempHeavy = firstSelected.selectedFile;
            } else {
                tempHeavy = this.props.reducer.getState().currentFile;
                this.numberOfFiles = 1;
            }

            let hasImage: boolean = false;
            let hasMultipleFrames: boolean = false;

            if (tempHeavy) {
                if (this.numberOfFiles === 1) {
                    hasImage = containsImage(tempHeavy.dicomData);
                    hasMultipleFrames = isMultiframe(tempHeavy.dicomData);
                } else {
                    hasImage = true;
                    hasMultipleFrames = true;
                }

                this.setState({
                    multiframe: hasMultipleFrames,
                    hasImage: hasImage,
                    isFileLoaded: true
                });
            } else {
                this.setState({
                    isFileLoaded: false,
                    hasImage: false
                });
            }
        }

    }

    private handleExport() {
        this.setState({exportActive: true});
        let exportMetadata: ExportMetadata = {
            excel: this.state.exportTags,
            image: this.state.exportImage,
            multiframe: this.state.multiframe
        };
        this.dummyExport(exportMetadata);
        this.clearCheckBoxes();
        this.props.handleClosePopUpDialog();
        this.setState({ openProgresDialog: true });
        this.props.reducer.getState().curentExportFileNumber = 0;
    }

    private dummyExport(exportMetadata: ExportMetadata) {
        new Downloader().download(exportMetadata, this.props.reducer);
    }

    private clearCheckBoxes() {
        this.setState({
            exportImage: false,
            exportTags: false
        });
    }

}