import * as React from 'react';
import { Dialog, LinearProgress } from 'material-ui';

export interface ProgresBarDialogProps {
    open: boolean;
    handleCloseDialog: Function;
    maxValue: number;
    currentValue: number;
}

export interface ProgresBarDialogState {

}

export class ProgresBarDialog extends React.Component<ProgresBarDialogProps, ProgresBarDialogState> {
    public constructor(props: ProgresBarDialogProps) {
        super(props);
    }

    public render() {
        return (
            <Dialog
                title={'Download in progress'}
                modal={true}
                open={this.props.open}
                onRequestClose={() => { this.props.handleCloseDialog(); }}
            >
                <LinearProgress
                    mode="determinate"
                    value={this.props.currentValue}
                    max={this.props.maxValue}
                />
            </Dialog>
        );
    }
}