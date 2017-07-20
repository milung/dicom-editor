import * as React from 'react';
import {
    Table,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    List,
    ListItem,
} from 'material-ui';
import { DicomEntry, DicomData, DicomGroupEntry } from '../../model/dicom-entry';

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
        let groupArray: DicomGroupEntry[] = [];
        if (this.props.data) {

            for (var groupNumber in this.props.data) {
                if (groupNumber) {
                    groupArray.push(this.props.data[groupNumber]);
                    this.props.data[groupNumber].entries.forEach(_ => {
                        finalArr.push(_);
                    });
                }
            }
            return (
                <List>
                    {groupArray.map((group, groupIndex) => {
                        return (
                            <ListItem
                                primaryText={group.groupNumber}
                                nestedItems={[

                                    <ListItem disabled={true}>
                                        {group.entries.map((entry, entryIndex) => {
                                            return (
                                                <Table selectable={false}>
                                                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                                        <TableRow>
                                                            <TableHeaderColumn>{entry.tagName}</TableHeaderColumn>
                                                            <TableHeaderColumn>{entry.tagValue}</TableHeaderColumn>
                                                        </TableRow>
                                                    </TableHeader>
                                                </Table>
                                            );
                                        })}
                                    </ListItem>

                                ]}
                            />
                        );
                    })}
                </List>
            );
        } else {
            return (<div />);
        }
    }
}
