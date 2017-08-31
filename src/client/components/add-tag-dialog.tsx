import * as React from 'react';
import { PopUpDialog } from './side-bar/pop-up-dialog';
import { DicomEntry } from '../model/dicom-entry';
import { TextField, Dialog, FlatButton } from 'material-ui';
import { validateDicomEntry, isValidationWithoutErrors } from '../utils/dicom-validator';
import { ERROR_MESSAGES, ERROR_STYLE, VALID_STYLE } from './dicom-table/dicom-table-row';
import { getValueMultiplicity } from '../utils/dicom-reader';

export interface AddTagDialogProps {
    handleClosePopUpDialog: () => void;
    handleCancelPopUpDialog: () => void;
    handleAction: (newEntry: DicomEntry) => void;
    openedPopUpDialog: boolean;
}

export interface AddTagDialogState {
    newEntry: DicomEntry;
    openedInvalidDialog: boolean;
}

const emptyDicomEntry: DicomEntry = {
    id: -1,
    tagElement: '',
    tagGroup: '',
    offset: 0,
    tagVM: '0',
    tagVR: '',
    byteLength: 0,
    tagName: '',
    tagValue: '',
    colour: '',
    sequence: []
};

export class AddTagDialog extends React.Component<AddTagDialogProps, AddTagDialogState> {
    public constructor(props: AddTagDialogProps) {
        super(props);

        this.state = {
            newEntry: emptyDicomEntry,
            openedInvalidDialog: false
        };

        this.handleConfirmClick = this.handleConfirmClick.bind(this);
    }

    public componentWillReceiveProps() {
        this.setState({ newEntry: emptyDicomEntry });
    }

    public render() {
        return (
            <div>
                <PopUpDialog
                    handleClosePopUpDialog={this.props.handleClosePopUpDialog}
                    handleCancelPopUpDialog={this.props.handleCancelPopUpDialog}
                    handleAction={this.handleConfirmClick}
                    openedPopUpDialog={this.props.openedPopUpDialog}
                    popUpText={''}
                    popUpQuestion={'Add new tag'}
                    popUpConfirmText={'Add new tag'}
                    popUpCancelText={'Cancel adding tag'}
                    modal={true}
                    body={this.renderBody()}
                    autoScroll={true}
                />

                <Dialog
                    title={'Invalid dicom entry'}
                    actions={[
                        <FlatButton
                            key={1}
                            label={'OK'}
                            primary={true}
                            onTouchTap={() => { this.setState({ openedInvalidDialog: false }); }}
                        />]
                    }
                    modal={true}
                    open={this.state.openedInvalidDialog}
                    onRequestClose={() => { this.setState({ openedInvalidDialog: false }); }}
                >
                    <p>You cannot save invalid dicom entry.</p>
                </Dialog>
            </div>

        );
    }

    private renderBody(): JSX.Element {
        let validationResult = validateDicomEntry(this.state.newEntry);
        let isValueValid = validationResult.tagValueErrors.length === 0;
        let isVRValid = validationResult.tagVRErrors.length === 0;
        let isGroupValid = validationResult.tagGroupErrors.length === 0;
        let isElementValid = validationResult.tagElementErrors.length === 0;

        let captionStyle = {
            marginBottom: '0px'
        };
        return (
            <div>
                <h2>Please provide tag information</h2>

                <h4 style={captionStyle}>Tag group:</h4>
                <TextField
                    id="new-group"
                    value={this.state.newEntry.tagGroup}
                    errorText={isGroupValid ? 'Value is valid' : ERROR_MESSAGES[validationResult.tagGroupErrors[0]]}
                    errorStyle={isGroupValid ? VALID_STYLE : ERROR_STYLE}
                    onChange={
                        (event: React.FormEvent<HTMLSelectElement>) => {
                            this.setState({
                                newEntry: {
                                    ...this.state.newEntry,
                                    tagGroup: event.currentTarget.value,
                                }
                            });
                        }
                    }
                />

                <h4 style={captionStyle}>Tag element:</h4>
                <TextField
                    id="new-element"
                    value={this.state.newEntry.tagElement}
                    errorText={isElementValid ? 'Value is valid' : ERROR_MESSAGES[validationResult.tagElementErrors[0]]}
                    errorStyle={isElementValid ? VALID_STYLE : ERROR_STYLE}
                    onChange={
                        (event: React.FormEvent<HTMLSelectElement>) => {
                            this.setState({
                                newEntry: {
                                    ...this.state.newEntry,
                                    tagElement: event.currentTarget.value,
                                }
                            });
                        }
                    }
                />

                <h4 style={captionStyle}>Tag value:</h4>
                <TextField
                    id="new-value"
                    value={this.state.newEntry.tagValue}
                    errorText={isValueValid ? 'Value is valid' : ERROR_MESSAGES[validationResult.tagValueErrors[0]]}
                    errorStyle={isValueValid ? VALID_STYLE : ERROR_STYLE}
                    onChange={
                        (event: React.FormEvent<HTMLSelectElement>) => {
                            this.setState({
                                newEntry: {
                                    ...this.state.newEntry,
                                    tagValue: event.currentTarget.value,
                                    tagVM: getValueMultiplicity(event.currentTarget.value).toString()
                                }
                            });
                        }
                    }
                />

                <h4 style={captionStyle}>Tag VR:</h4>
                <TextField
                    id="new-vr"
                    value={this.state.newEntry.tagVR}
                    errorText={isVRValid ? 'Value is valid' : ERROR_MESSAGES[validationResult.tagVRErrors[0]]}
                    errorStyle={isVRValid ? VALID_STYLE : ERROR_STYLE}
                    onChange={
                        (event: React.FormEvent<HTMLSelectElement>) => {
                            this.setState({
                                newEntry: {
                                    ...this.state.newEntry,
                                    tagVR: event.currentTarget.value
                                }
                            });
                        }
                    }
                />
            </div>
        );
    }

    private handleConfirmClick() {
        let result = validateDicomEntry(this.state.newEntry);
        if (isValidationWithoutErrors(result)) {
            this.props.handleAction(this.state.newEntry);
        } else {
            this.setState({
                openedInvalidDialog: true
            });
        }
    }
}