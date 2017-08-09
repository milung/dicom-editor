import * as React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import { DicomEntry } from '../../model/dicom-entry';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './dicom-table.css';

var ExpandIcon = require('react-icons/lib/md/arrow-drop-down');

export interface DicomSequenceRowProps {
    entry: DicomEntry;
    handleClick?: () => void;
}

export interface DicomSequenceRowState {

}

export class DicomSequenceRow extends React.Component<DicomSequenceRowProps, DicomSequenceRowState> {
    private colorDict: ColorDictionary;

    public constructor(props: DicomSequenceRowProps) {
        super(props);
        this.colorDict = new ColorDictionary();
    }

    public render() {
        let tableRowStyle = { color: this.props.entry.colour, backgroundColor: 'rgb(199, 213, 237)' };
        let tagColor = { color: '#000000' };
        let tableRowColumnStyle = {
            whiteSpace: 'normal',
            wordWrap: 'break-word'
        };
        let tag = this.props.entry.tagGroup + ', ' + this.props.entry.tagElement;
        let rowClass = 'tagBorder';
        return (
            <TableRow style={tableRowStyle} className={rowClass} onRowClick={this.props.handleClick}>
                <TableRowColumn style={tagColor}><ExpandIcon className="expandable-icon" />
                    {tag}
                </TableRowColumn>
                <TableRowColumn style={tableRowColumnStyle}>{this.props.entry.tagName}</TableRowColumn>
                <TableRowColumn style={tableRowColumnStyle}>{this.props.entry.tagValue}</TableRowColumn>
                <TableRowColumn>{this.props.entry.tagVR}</TableRowColumn>
                <TableRowColumn>{this.props.entry.tagVM}</TableRowColumn>
            </TableRow>
        );
    }

}