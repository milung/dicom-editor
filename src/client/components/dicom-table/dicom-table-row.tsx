import * as React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import { DicomEntry } from '../../model/dicom-entry';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './dicom-table.css';

var fileDownload = require('react-file-download');

export interface DicomTableRowProps {
    entry: DicomEntry;
    shouldShowTag: boolean;
    margin?: string;
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
        let tableRowStyle = { color: this.props.entry.colour };
        let tagColor = this.props.margin ? { paddingLeft: this.props.margin, color: '#000000' } : { color: '#000000' };
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

        return (
            <TableRow style={tableRowStyle} className={rowClass} >
                <TableRowColumn style={tagColor}>
                    {tag}
                </TableRowColumn>
                <TableRowColumn style={tableRowColumnStyle}>{this.props.entry.tagName}</TableRowColumn>
                <TableRowColumn style={tableRowColumnStyle}>{ele}</TableRowColumn>
                <TableRowColumn>{this.props.entry.tagVR}</TableRowColumn>
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
}