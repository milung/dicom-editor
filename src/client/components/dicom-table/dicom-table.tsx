import * as React from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui';
import { DicomEntry, DicomData } from '../../model/dicom-entry';

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
        let finalArr: DicomEntry[] = [];
        if (this.props.data) {

            for (var groupNumber in this.props.data) {
                if (groupNumber) {
                    this.props.data[groupNumber].entries.forEach(_ => {
                        finalArr.push(_);
                    });
                }
            }
            return (
                <Table selectable={false}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Tag Name</TableHeaderColumn>
                            <TableHeaderColumn>Value</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {finalArr.map((_, index) => {

                            return (
                                <TableRow key={index}>
                                    <TableRowColumn>{_.tagName}</TableRowColumn>
                                    <TableRowColumn>{_.tagValue}</TableRowColumn>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            );
        } else {
            return (<div />);
        }
    }
}
