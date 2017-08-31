import * as React from 'react';
import { TableRow, TableHeaderColumn } from 'material-ui';

export interface DicomTableHeaderProps {

}

export interface DicomTableHeaderState {

}

export class DicomTableHeader extends React.Component<DicomTableHeaderProps, DicomTableHeaderState> {
    public constructor(props: DicomTableHeaderProps) {
        super(props);
    }

    public render() {
        let tableRowStyle = { 
            color: '#FFFFFF', 
            backgroundColor: '#009999',
            fontSize: '0.9em',
            width: '10%'
        };
        let tableRowStyle2 = { 
            color: '#FFFFFF', 
            backgroundColor: '#009999',
            fontSize: '0.9em',
            width: '25%' 
        };
        let tableRowStyle3 = { 
            color: '#FFFFFF', 
            backgroundColor: '#009999',
            fontSize: '0.9em',
            width: '30%' 
        };

        return (
                <TableRow>
                    <TableHeaderColumn style={tableRowStyle2}>
                        Tag group, tag element
                    </TableHeaderColumn>
                    <TableHeaderColumn style={tableRowStyle2}>
                        Tag name
                    </TableHeaderColumn>
                    <TableHeaderColumn style={tableRowStyle3}>
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