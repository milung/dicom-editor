import * as React from 'react';
import { PopUpDialog } from './pop-up-dialog';
import { ApplicationStateReducer } from '../../application-state';

interface OverridePopUpDialogProps {
    reducer: ApplicationStateReducer;
    saveFile: Function;
    handleCloseOverrideDialog: Function;
    openedOverrideDialog: boolean;
}

interface OverridePopUpDialogState {
}

export default class OverridePopUpDialog extends React.Component<OverridePopUpDialogProps, OverridePopUpDialogState> {
    constructor(props: OverridePopUpDialogProps) {
        super(props);

        this.handleOverrideButton = this.handleOverrideButton.bind(this);
    }

    render() {
        return (
            <PopUpDialog
                handleClosePopUpDialog={this.props.handleCloseOverrideDialog}
                handleCancelPopUpDialog={this.props.handleCloseOverrideDialog}
                handleAction={this.handleOverrideButton}
                openedPopUpDialog={this.props.openedOverrideDialog}
                popUpQuestion="Overwrite the file ?"
                popUpConfirmText="Overwrite the file"
                popUpText="There is already a file with this name in the database. Do you want to overwrite it?"
            />
        );
    }

    private handleOverrideButton() {
        let file = this.props.reducer.getState().currentFile;
        if (file) {
            this.props.saveFile(file);
        }
        this.props.handleCloseOverrideDialog();
    }
}