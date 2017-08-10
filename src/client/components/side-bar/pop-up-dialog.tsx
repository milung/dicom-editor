import * as React from 'react';
import { Dialog, FlatButton } from 'material-ui';

export interface PopUpDialogProps {
    handleClosePopUpDialog: Function;
    handleAction: Function;
    openedPopUpDialog: boolean;
    popUpText: string;
    popUpConfirmText: string;
}

export interface PopUpDialogState {

}

export class PopUpDialog extends React.Component<PopUpDialogProps, PopUpDialogState> {
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
                label={this.props.popUpConfirmText}
                primary={true}
                onTouchTap={() => { this.props.handleAction(); }}
            />
        ),
    ];

    public constructor(props: PopUpDialogProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <Dialog
                    title={this.props.popUpConfirmText + ' ?'}
                    actions={this.actions}
                    modal={false}
                    open={this.props.openedPopUpDialog}
                    onRequestClose={() => {this.props.handleClosePopUpDialog(); }}
                >
                    {this.props.popUpText}
                </Dialog>
            </div>
        );
    }
}