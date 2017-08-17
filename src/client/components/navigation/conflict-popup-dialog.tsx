import * as React from 'react';
import { Dialog, FlatButton } from 'material-ui';

export interface ConflictPopUpDialogProps {
    handleCloseDialog: Function;
    overWriteAll: Function;
    skipAll: Function;
    decideForEach: Function;
    numberOfConflicting: number;
    openedPopUpDialog: boolean;
}

export interface ConflictPopUpDialogState {

}

export class ConflictPopUpDialog extends React.Component<ConflictPopUpDialogProps, ConflictPopUpDialogState> {
    private actions = [
        (
            <FlatButton
                label="Skip all"
                primary={true}
                onTouchTap={() => { this.props.skipAll(); this.props.handleCloseDialog(); }}
            />
        ),
        (
            <FlatButton
                label="Overwrite all"
                primary={true}
                onTouchTap={() => { this.props.overWriteAll(); this.props.handleCloseDialog(); }}
            />
        ),
        (
            <FlatButton
                label="Decide for each"
                primary={true}
                onTouchTap={() => { this.props.decideForEach(); this.props.handleCloseDialog(); }}
            />
        ),
    ];

    public constructor(props: ConflictPopUpDialogProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Dialog
                    title="Some files are already saved"
                    actions={this.actions}
                    modal={false}
                    open={this.props.openedPopUpDialog}
                    onRequestClose={() => { this.props.handleCloseDialog(); }}
                >
                    Number of files: {this.props.numberOfConflicting} <br/>
                    What do you want to do?
                </Dialog>
            </div>
        );
    }
}