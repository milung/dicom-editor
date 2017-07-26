import * as React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import { DicomEntry } from '../../model/dicom-entry';
import { ColorDictionary } from '../../utils/colour-dictionary';

export interface DicomTableRowProps {
    entry: DicomEntry;
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
        return (
            <TableRow>
                <TableRowColumn>
                    {this.props.entry.tagGroup}{', '}{this.props.entry.tagElement}
                </TableRowColumn>
                <TableRowColumn>{this.props.entry.tagName}</TableRowColumn>
                <TableRowColumn>{this.props.entry.tagValue}</TableRowColumn>
                <TableRowColumn>{this.props.entry.tagVR}</TableRowColumn>
                <TableRowColumn>{this.props.entry.tagVM}</TableRowColumn>
            </TableRow>
        );
    }
}