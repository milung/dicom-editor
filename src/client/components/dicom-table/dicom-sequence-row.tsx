import * as React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import { DicomEntry } from '../../model/dicom-entry';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './dicom-table.css';
import { ActionDelete } from 'material-ui/svg-icons';

var ExpandIcon = require('react-icons/lib/md/keyboard-arrow-down');
var CollapseIcon = require('react-icons/lib/md/keyboard-arrow-up');

export interface DicomSequenceRowProps {
    entry: DicomEntry;
    handleClick?: () => void;
    margin?: string;
    expanded: boolean;
    handleDeletingEntry?: () => void;
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
        // let tableRowColumnStyle = {
        //     whiteSpace: 'normal',
        //     wordWrap: 'break-word'
        // };
        let tagStyle = this.props.margin ? { paddingLeft: this.props.margin, width: '10%' } : {};
        let tag = this.props.entry.tagGroup + ', ' + this.props.entry.tagElement;
        let removeInSequenceStyle = {
            paddingLeft: '12px'
        };
        let icon = this.props.expanded ?
            <CollapseIcon className="expandable-icon" />
            : <ExpandIcon className="expandable-icon" />;
        return (
            <TableRow style={tableRowStyle} className={'sequence-table-row'} onRowClick={this.props.handleClick}>
                <TableRowColumn style={tagStyle}>
                    {icon}
                    <ActionDelete
                        style={removeInSequenceStyle}
                        className="row-icon row-icon-delete"
                        onClick={this.props.handleDeletingEntry}
                    />
                </TableRowColumn>
                <TableRowColumn 
                    className={'table-row-tag-column table-row-column-small'}
                    style={{width: '15%'}}
                >
                    {tag}
                </TableRowColumn>
                <TableRowColumn
                    className={'table-row-column table-row-column-big'}
                    style={{width: '25%'}}
                >
                    {this.props.entry.tagName}
                </TableRowColumn>
                <TableRowColumn
                    className={'table-row-column table-row-column-biggest'}
                    style={{width: '30%'}}
                >
                    {this.props.entry.tagValue}
                </TableRowColumn>
                <TableRowColumn className={'table-row-column table-row-column-small'} style={{width: '10%'}}>
                    {this.props.entry.tagVR}
                </TableRowColumn>
                <TableRowColumn className={'table-row-column table-row-column-small'} style={{width: '10%'}}>
                    {this.props.entry.tagVM}
                </TableRowColumn>
            </TableRow>
        );
    }

}