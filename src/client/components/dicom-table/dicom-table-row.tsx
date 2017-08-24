import * as React from 'react';
import { TableRow, TableRowColumn, TextField } from 'material-ui';
import { DicomEntry } from '../../model/dicom-entry';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './dicom-table.css';
import { EditorModeEdit, ActionDone, ActionDelete } from 'material-ui/svg-icons';

var fileDownload = require('react-file-download');
const PIXEL_DATA_GROUP: string = '7fe0';
const PIXEL_DATA_ELEMENT: string = '0010';

export interface DicomTableRowProps {
    entry: DicomEntry;
    shouldShowTag: boolean;
    margin?: string;
    editMode?: boolean;
    handleEnterEditing?: () => void;
    handleExitEditing?: Function;
    handleDeletingEntry?: () => void;
}

export interface DicomTableRowState {
    newTagValue: string | number | undefined;
    newTagVR: string | number | undefined;
}

export class DicomTableRow extends React.Component<DicomTableRowProps, DicomTableRowState> {
    private colorDict: ColorDictionary;

    public constructor(props: DicomTableRowProps) {
        super(props);

        this.state = {
            newTagValue: this.props.entry.tagValue,
            newTagVR: this.props.entry.tagVR
        };
        this.colorDict = new ColorDictionary();

        this.handleExitEdit = this.handleExitEdit.bind(this);
    }

    public render() {
        let tableRowStyle = { color: this.props.entry.colour };
        let tagStyle = this.props.margin ? { paddingLeft: this.props.margin, color: '#000000' } : { color: '#000000' };
        let tableRowColumnStyle = {
            whiteSpace: 'normal',
            wordWrap: 'break-word'
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

        if (this.props.editMode) {
            firstIcon = (
                <ActionDone
                    className="row-icon row-icon-done"
                    onClick={this.handleExitEdit}
                />
            );
            valueCell = (
                <TableRowColumn style={tableRowColumnStyle}>
                    <TextField
                        id="new-value"
                        style={tableRowColumnStyle}
                        value={this.state.newTagValue}
                        onChange={
                            (event: React.FormEvent<HTMLSelectElement>) => {
                                this.setState({
                                    newTagValue: event.currentTarget.value
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
                        style={tableRowColumnStyle}
                        value={this.state.newTagVR}
                        onChange={
                            (event: React.FormEvent<HTMLSelectElement>) => {
                                this.setState({
                                    newTagVR: event.currentTarget.value
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
            let isPixelData = this.props.entry.tagGroup === PIXEL_DATA_GROUP
                && this.props.entry.tagElement === PIXEL_DATA_ELEMENT;
            if (!isPixelData) {
                firstIcon = (
                    <EditorModeEdit
                        className="row-icon row-icon-edit"
                        onClick={this.props.handleEnterEditing}
                    />
                );
            }

            secondIcon = (
                <ActionDelete
                    className="row-icon row-icon-delete"
                    onClick={this.props.handleDeletingEntry}
                />
            );
            valueCell = <TableRowColumn style={tableRowColumnStyle}>{ele}</TableRowColumn>;
            vrCell = <TableRowColumn>{this.props.entry.tagVR}</TableRowColumn>;
        }

        return (
            <TableRow style={tableRowStyle} className={rowClass} >
                <TableRowColumn style={tagStyle}>
                    {firstIcon}
                    {secondIcon}
                    {tag}
                </TableRowColumn>
                <TableRowColumn style={tableRowColumnStyle}>{this.props.entry.tagName}</TableRowColumn>
                {valueCell}
                {vrCell}
                <TableRowColumn>{this.props.entry.tagVM}</TableRowColumn>
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
            if (this.state.newTagValue && this.state.newTagVR) {
                let newEntry: DicomEntry = { ...this.props.entry };
                newEntry.tagValue = this.state.newTagValue.toString();
                newEntry.tagVR = this.state.newTagVR.toString();
                this.props.handleExitEditing(newEntry);
            }
        }
    }
}