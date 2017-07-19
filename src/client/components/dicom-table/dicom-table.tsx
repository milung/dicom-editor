import * as React from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui';

import { DicomData } from '../../model/dicom-entry';

interface DicomTableProps {
    data: DicomData;
}

interface DicomTableState {
}

export class DicomTable extends React.Component<DicomTableProps, DicomTableState> {
    constructor(props: DicomTableProps) {
        super(props);
    }

    render() {
        return (
            <Table selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Tag Name</TableHeaderColumn>
                        <TableHeaderColumn>Value</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {/* {this.props.data.map((_, index) => {
                        return (
                            <TableRow key={index}>
                                <TableRowColumn>{_.tagName}</TableRowColumn>
                                <TableRowColumn>{_.tagValue}</TableRowColumn>
                            </TableRow>
                        );
                    })} */}
                </TableBody>
            </Table>
        );
    }
}
