import * as React from 'react';
import { PopUpDialog } from '../side-bar/pop-up-dialog';
import { HeavyweightFile } from '../../model/file-interfaces';

interface OverridePopUpDialogProps {
    saveFile: Function;
    handleCancelOverrideDialog: Function;
    handleCloseOverrideDialog: Function;
    openedOverrideDialog: boolean;
    fileName: string;
    file: HeavyweightFile;
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
        if (this.props.file) {
            this.props.saveFile(this.props.file);
        }
        this.props.handleCancelOverrideDialog();
    }
}