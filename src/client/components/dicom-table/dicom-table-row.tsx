import * as React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import { DicomEntry } from '../../model/dicom-entry';
import { ColourDictionary } from '../../utils/colour-dictionary';

export interface DicomTableRowProps {
    entry: DicomEntry;
}

export interface DicomTableRowState {

}

export class DicomTableRow extends React.Component<DicomTableRowProps, DicomTableRowState> {
    private colorDict: ColourDictionary;

    public constructor(props: DicomTableRowProps) {
        super(props);
        this.colorDict = new ColourDictionary();
    }

    public render() {
        let tableRowStyle = { color: this.colorDict.getFirstFreeColor()};
        return (
                <TableRow style={tableRowStyle}>
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