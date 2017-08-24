import * as React from 'react';
import { Dialog, FlatButton } from 'material-ui';

export interface PopUpDialogProps {
    handleCancelPopUpDialog: Function;
    handleClosePopUpDialog: Function;
    handleAction: Function;
    openedPopUpDialog: boolean;
    popUpText: string;
    popUpQuestion: string;
    popUpConfirmText: string;
}

export interface PopUpDialogState {

}

export class PopUpDialog extends React.Component<PopUpDialogProps, PopUpDialogState> {
    public constructor(props: PopUpDialogProps) {
        super(props);
    }

    public render() {
        let actions = [
            (
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onTouchTap={() => { this.props.handleCancelPopUpDialog(); }}
                />
            ),
            (
                <FlatButton
                    label={this.props.popUpConfirmText}
                    primary={true}
                    onTouchTap={() => { this.props.handleAction(); }}
                />
            ),
        ];
        return (
            <div>
                <Dialog
                    title={this.props.popUpQuestion}
                    actions={actions}
                    modal={false}
                    open={this.props.openedPopUpDialog}
                    onRequestClose={() => { this.props.handleClosePopUpDialog(); }}
                >
                    {this.props.popUpText}
                </Dialog>
            </div>
        );
    }
}