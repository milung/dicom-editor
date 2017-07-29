import * as React from 'react';
import { Dialog, FlatButton } from 'material-ui';

export interface OverrideDialogProps {
    handleCloseOverrideDialog: Function;
    handleOverrideButton: Function;
    openedOverrideDialog: boolean;
}

export interface OverrideDialogState {

}

export class OverrideDialog extends React.Component<OverrideDialogProps, OverrideDialogState> {
    private actions = [
        (
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => { this.props.handleCloseOverrideDialog(); }}
            />
        ),
        (
            <FlatButton
                label="Override file"
                primary={true}
                onTouchTap={() => { this.props.handleOverrideButton(); }}
            />
        ),
    ];

    public constructor(props: OverrideDialogProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Dialog
                    title="Override the file?"
                    actions={this.actions}
                    modal={false}
                    open={this.props.openedOverrideDialog}
                    onRequestClose={() => {this.props.handleCloseOverrideDialog(); }}
                >
                    There is already a file with this name in the database. Do you want to override it?
                </Dialog>
            </div>
        );
    }
}