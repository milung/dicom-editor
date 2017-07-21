import * as React from 'react';
import { TableRow, TableHeaderColumn } from "material-ui";

export interface DicomTableHeaderProps {

}

export interface DicomTableHeaderState {

}

export class DicomTableHeader extends React.Component<DicomTableHeaderProps, DicomTableHeaderState> {
    public constructor(props: DicomTableHeaderProps) {
        super(props);
    }

    public render() {
        let tableRowStyle = { color: '#FFFFFF' };
        return (
           
                <TableRow>
                    <TableHeaderColumn style={tableRowStyle}>
                        Tag group, tag element
                    </TableHeaderColumn>
                    <TableHeaderColumn style={tableRowStyle}>
                        Tag name
                    </TableHeaderColumn>
                    <TableHeaderColumn style={tableRowStyle}>
                        Tag value
                    </TableHeaderColumn>
                    <TableHeaderColumn style={tableRowStyle}>
                        VR
                    </TableHeaderColumn>
                    <TableHeaderColumn style={tableRowStyle}>
                        VM
                    </TableHeaderColumn>
                </TableRow>
        );
    }
}