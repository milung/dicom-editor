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
    popUpCancelText?: string;
    body?: JSX.Element;
    modal?: boolean;
    autoScroll?: boolean;
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
                    label={this.props.popUpCancelText ? this.props.popUpCancelText : 'Cancel'}
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
                    modal={this.props.modal ? this.props.modal : false}
                    open={this.props.openedPopUpDialog}
                    onRequestClose={() => { this.props.handleClosePopUpDialog(); }}
                    autoScrollBodyContent={this.props.autoScroll ? this.props.autoScroll : false}
                >
                    {this.props.body ? this.props.body : this.props.popUpText}
                </Dialog>
            </div>
        );
    }
}