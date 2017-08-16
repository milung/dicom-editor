import * as React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import { DicomEntry } from '../../model/dicom-entry';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './dicom-table.css';

var ExpandIcon = require('react-icons/lib/md/keyboard-arrow-down');
var CollapseIcon = require('react-icons/lib/md/keyboard-arrow-up');

export interface DicomSequenceRowProps {
    entry: DicomEntry;
    handleClick?: () => void;
    margin?: string;
    expanded: boolean;
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
        let tableRowStyle = { color: this.props.entry.colour };
        let tagStyle = this.props.margin ? { paddingLeft: this.props.margin } : {};
        let tag = this.props.entry.tagGroup + ', ' + this.props.entry.tagElement;
        let icon = this.props.expanded ?
            <CollapseIcon className="expandable-icon" />
            : <ExpandIcon className="expandable-icon" />;
        return (
            <TableRow style={tableRowStyle} className={'sequence-table-row'} onRowClick={this.props.handleClick}>
                <TableRowColumn style={tagStyle} className={'table-row-tag-column'}>
                    {icon}{tag}
                </TableRowColumn>
                <TableRowColumn className={'table-row-column'}>{this.props.entry.tagName}</TableRowColumn>
                <TableRowColumn className={'table-row-column'}>{this.props.entry.tagValue}</TableRowColumn>
                <TableRowColumn>{this.props.entry.tagVR}</TableRowColumn>
                <TableRowColumn>{this.props.entry.tagVM}</TableRowColumn>
            </TableRow>
        );
    }

}