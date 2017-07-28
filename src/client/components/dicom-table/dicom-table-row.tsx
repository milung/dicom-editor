import * as React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import { DicomEntry } from '../../model/dicom-entry';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './dicom-table.css';

export interface DicomTableRowProps {
    entry: DicomEntry;
    shouldShowTag: boolean; 
}

export interface DicomTableRowState {

}

export class DicomTableRow extends React.Component<DicomTableRowProps, DicomTableRowState> {
    private colorDict: ColorDictionary;

    public constructor(props: DicomTableRowProps) {
        super(props);
        this.colorDict = new ColorDictionary();
    }

    public render() {
        let tableRowStyle = { color: this.props.entry.colour};
        let tagColor = { color: '#000000'};
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
        return (
                <TableRow style={tableRowStyle} className={rowClass}>
                    <TableRowColumn style={tagColor}>
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