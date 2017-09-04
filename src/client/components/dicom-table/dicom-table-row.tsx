import * as React from 'react';
import { TableRow, TableRowColumn, TextField } from 'material-ui';
import { DicomEntry } from '../../model/dicom-entry';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './dicom-table.css';
import { EditorModeEdit, ActionDone, ActionDelete, ContentClear, ActionLock } from 'material-ui/svg-icons';
import { getValueMultiplicity } from '../../utils/dicom-reader';
import { validateDicomEntry, ErrorType } from '../../utils/dicom-validator';
import { vrTooltipDictionary } from '../../utils/vr-tooltips-dictionary';
import { ValidationTooltip } from './validation-tooltip';
import * as ReactTooltip from 'react-tooltip';

var fileDownload = require('react-file-download');
const PIXEL_DATA_GROUP: string = '7fe0';
const PIXEL_DATA_ELEMENT: string = '0010';
const TRANSFER_SYNTAX_UID_GROUP: string = '0002';
const TRANSFER_SYNTAX_UID_ELEMENT: string = '0010';

export const VALID_STYLE = {
    color: '#00e600'
};

export const ERROR_STYLE = {
    color: '#ff0000'
};

export const ERROR_MESSAGES = {};
ERROR_MESSAGES[ErrorType.INVALID_VR] = 'Invalid VR';
ERROR_MESSAGES[ErrorType.VALUE_NOT_MATCH_VR] = 'Value does not match VR';
ERROR_MESSAGES[ErrorType.INVALID_ELEMENT] = 'Invalid tag element';
ERROR_MESSAGES[ErrorType.INVALID_GROUP] = 'Invalid tag group';
ERROR_MESSAGES[ErrorType.INVALID_NAME] = 'Invalid tag name';

export interface DicomTableRowProps {
    entry: DicomEntry;
    shouldShowTag: boolean;
    margin?: string;
    editMode?: boolean;
    compareMode?: boolean;
    handleEnterEditing?: () => void;
    handleExitEditing?: Function;
    handleDeletingEntry?: () => void;
    handleClearEditing?: Function;
}

export interface DicomTableRowState {
    newEntry: DicomEntry;
}

export class DicomTableRow extends React.Component<DicomTableRowProps, DicomTableRowState> {
    private colorDict: ColorDictionary;

    public constructor(props: DicomTableRowProps) {
        super(props);

        this.state = {
            newEntry: JSON.parse(JSON.stringify(this.props.entry))
        };
        this.colorDict = new ColorDictionary();
        this.handleExitEdit = this.handleExitEdit.bind(this);
        this.handleClearEdit = this.handleClearEdit.bind(this);
    }

    public componentWillReceiveProps(nextProps: DicomTableRowProps) {
        // if changing from non edit mode to edit mode
        if (!this.props.editMode && nextProps.editMode) {
            this.setState({
                newEntry: JSON.parse(JSON.stringify(this.props.entry))
            });
        } else {
            if (!nextProps.editMode) {
                this.setState({ newEntry: { ...this.state.newEntry, tagVM: nextProps.entry.tagVM } });
            }
        }
    }

    public render() {
        let tableRowStyle = { color: this.props.entry.colour };
        let tagStyle = this.props.margin
            ? { paddingLeft: this.props.margin, color: '#000000', width: this.props.compareMode ? '0%' : '10%' }
            : { color: '#000000', width: this.props.compareMode ? '0%' : '10%' };
        let tableRowColumnStyle = {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            width: '10%'
        };
        let tableRowColumnStyle1 = {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            width: '15%'
        };
        let tableRowColumnStyle2 = {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            width: '25%'
        };
        let tableRowColumnStyle3 = {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            width: this.props.compareMode ? '40%' : '30%'
        };
        let tag = this.props.entry.tagGroup + ', ' + this.props.entry.tagElement;
        let rowClass = 'tagBorder';
        if (!this.props.shouldShowTag) {
            tag = '';
            rowClass = '';
        }

        let ele: JSX.Element;
        if (this.props.entry.tagValue) {
            if (this.props.entry.tagValue.toString().length > 100) {
                let value = this.props.entry.tagValue.toString().substr(0, 100) + '...';
                ele =
                    (
                        <span onClick={() => this.handleExcessiveText()}>
                            <div className="plain-link">
                                <div className="show-comment-on-hover">
                                    Click to downlad a text file with the tag value
                                </div>
                                {value}
                            </div>
                        </span>
                    );
            } else {
                ele = <div>{this.props.entry.tagValue}</div>;
            }
        } else {
            ele = <div />;
        }

        // Edit mode

        let firstIcon;
        let secondIcon;
        let valueCell;
        let vrCell;
        let vrTooltip = vrTooltipDictionary[this.state.newEntry.tagVR];
        let tooltipIcon = (
            <ValidationTooltip vrTooltip={vrTooltip} />
        );

        let validationResult = validateDicomEntry(this.state.newEntry);
        let isValueValid = validationResult.tagValueErrors.length === 0;
        let isVRValid = validationResult.tagVRErrors.length === 0;

        if (this.props.editMode) {
            firstIcon = (
                <ActionDone
                    className="row-icon row-icon-done"
                    onClick={this.handleExitEdit}
                />
            );
            secondIcon = (
                <ContentClear
                    className="row-icon row-icon-clear"
                    onClick={this.handleClearEdit}
                />
            );
            valueCell = (
                <TableRowColumn className="aaaaa">
                    {!isValueValid ? tooltipIcon : <div data-tip="hello" />}
                    <TextField
                        id="new-value"
                        value={this.state.newEntry.tagValue}
                        errorText={isValueValid ? 'Value is valid' : ERROR_MESSAGES[validationResult.tagValueErrors[0]]}
                        errorStyle={isValueValid ? VALID_STYLE : ERROR_STYLE}
                        onChange={
                            (event: React.FormEvent<HTMLSelectElement>) => {
                                let entry = this.state.newEntry;
                                entry.tagValue = event.currentTarget.value;
                                entry.tagVM = getValueMultiplicity(event.currentTarget.value).toString();
                                this.setState({
                                    newEntry: entry,
                                });
                            }
                        }
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                this.handleExitEdit();
                            }
                        }}
                    />
                </TableRowColumn>
            );

            vrCell = (
                <TableRowColumn>
                    <TextField
                        id="new-vr"
                        value={this.state.newEntry.tagVR}
                        errorText={isVRValid ? 'Value is valid' : ERROR_MESSAGES[validationResult.tagVRErrors[0]]}
                        errorStyle={isVRValid ? VALID_STYLE : ERROR_STYLE}
                        onChange={
                            (event: React.FormEvent<HTMLSelectElement>) => {
                                let entry = this.state.newEntry;
                                entry.tagVR = event.currentTarget.value;
                                this.setState({
                                    newEntry: entry,
                                });
                            }
                        }
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                this.handleExitEdit();
                            }
                        }}

                    />
                </TableRowColumn>
            );

        } else {

            if (this.props.compareMode === undefined || this.props.compareMode === false) {
                let isPixelData = this.props.entry.tagGroup === PIXEL_DATA_GROUP
                    && this.props.entry.tagElement === PIXEL_DATA_ELEMENT;

                let isTransferSyntaxUID = this.props.entry.tagGroup === TRANSFER_SYNTAX_UID_GROUP
                    && this.props.entry.tagElement === TRANSFER_SYNTAX_UID_ELEMENT;

                if (!isPixelData && !isTransferSyntaxUID) {
                    firstIcon = (
                        <EditorModeEdit
                            className="row-icon row-icon-edit"
                            onClick={this.props.handleEnterEditing}
                        />
                    );
                    secondIcon = (
                        <ActionDelete
                            className="row-icon row-icon-delete"
                            onClick={this.props.handleDeletingEntry}
                        />
                    );
                } else {
                    firstIcon = secondIcon = (
                        <div className="tooltip">
                            <ActionLock data-tip="lockTooltip" className="row-icon row-icon-lock" />
                            <ReactTooltip aria-haspopup="true" place="right" effect="solid">
                                <p> {'This value can not be edited'} </p>
                            </ReactTooltip>
                        </div>
                    );
                }
            }

            valueCell = <TableRowColumn style={tableRowColumnStyle3}>{ele}</TableRowColumn>;
            vrCell = <TableRowColumn style={tableRowColumnStyle}>{this.props.entry.tagVR}</TableRowColumn>;
        }

        return (
            <TableRow style={tableRowStyle} className={rowClass} >
                <TableRowColumn style={tagStyle}>
                    {firstIcon}
                    {secondIcon}
                </TableRowColumn>
                <TableRowColumn style={tableRowColumnStyle1}>
                    {tag}
                </TableRowColumn>
                <TableRowColumn style={tableRowColumnStyle2}>{this.props.entry.tagName}</TableRowColumn>
                {valueCell}
                {vrCell}
                <TableRowColumn style={tableRowColumnStyle}>{this.state.newEntry.tagVM}</TableRowColumn>
            </TableRow>
        );
    }

    private handleExcessiveText() {
        let val = this.props.entry.tagValue.toString();
        if (val.length > 100) {
            let blob = new Blob([val], { type: 'text/plain;charset=utf-8' });
            let fileName = this.props.entry.tagName +
                ' (' + this.props.entry.tagGroup + ', ' + this.props.entry.tagElement + ') -value.txt';
            fileDownload(blob, fileName);
        }
    }

    private handleExitEdit() {
        if (this.props.handleExitEditing) {
            this.props.handleExitEditing(this.state.newEntry);
        }
    }

    private handleClearEdit() {
        if (this.props.handleClearEditing) {
            this.props.handleClearEditing();
        }
    }
}