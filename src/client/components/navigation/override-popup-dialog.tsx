import * as React from 'react';
import { PopUpDialog } from '../side-bar/pop-up-dialog';
import { ApplicationStateReducer } from '../../application-state';

interface OverridePopUpDialogProps {
    reducer: ApplicationStateReducer;
    saveFile: Function;
    handleCloseOverrideDialog: Function;
    openedOverrideDialog: boolean;
}

interface OverridePopUpDialogState {
}

export class OverridePopUpDialog extends React.Component<OverridePopUpDialogProps, OverridePopUpDialogState> {
    constructor(props: OverridePopUpDialogProps) {
        super(props);

        this.handleOverrideButton = this.handleOverrideButton.bind(this);
    }

    render() {
        return (
            <PopUpDialog
                handleClosePopUpDialog={this.props.handleCloseOverrideDialog}
                handleAction={this.handleOverrideButton}
                openedPopUpDialog={this.props.openedOverrideDialog}
                popUpConfirmText="Override the file"
                popUpText="There is already a file with this name in the database. Do you want to override it?"
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