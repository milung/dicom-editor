import * as React from 'react';
import { PopUpDialog } from '../side-bar/pop-up-dialog';
import { ApplicationStateReducer } from '../../application-state';

interface OverridePopUpDialogProps {
    reducer: ApplicationStateReducer;
    saveFile: Function;
    handleCancelOverrideDialog: Function;
    handleCloseOverrideDialog: Function;
    openedOverrideDialog: boolean;
    fileName: string;
}

interface OverridePopUpDialogState {
}

export class OverridePopUpDialog extends React.Component<OverridePopUpDialogProps, OverridePopUpDialogState> {
    constructor(props: OverridePopUpDialogProps) {
        super(props);

        this.handleOverrideButton = this.handleOverrideButton.bind(this);
    }

    render() {
        var question = 'Overwrite the file ' + this.props.fileName;
        return (
            <PopUpDialog
                handleClosePopUpDialog={this.props.handleCloseOverrideDialog}
                handleAction={this.handleOverrideButton}
                openedPopUpDialog={this.props.openedOverrideDialog}
                popUpQuestion={question}
                popUpConfirmText="Overwrite"
                popUpText="There is already a file with this name. Do you want to override it?"
                handleCancelPopUpDialog={this.props.handleCancelOverrideDialog}
            />
        );
    }

    private async handleOverrideButton() {
        let file = this.props.reducer.getState().currentFile;
        if (file) {
           this.props.saveFile(file);
        }
        this.props.handleCancelOverrideDialog();
    }
}