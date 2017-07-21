import * as React from 'react';
import {
    Table,
    List,
    ListItem,
    TableBody,
    TableHeader,
} from 'material-ui';
import { DicomData, DicomGroupEntry } from '../../model/dicom-entry';
import './dicom-table.css';
import { DicomTableRow } from "./dicom-table-row";
import { DicomTableHeader } from "./dicom-table-header";

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
        let groupArray: DicomGroupEntry[] = [];
        // let keyCounter = 0;
        if (this.props.data) {

            for (var groupNumber in this.props.data) {
                if (groupNumber) {
                    groupArray.push(this.props.data[groupNumber]);
                }
            }
            return (
                <List>
                    {/* iterates over groups */}
                    {groupArray.map((group, groupIndex) => {
                        return (
                            <ListItem
                                primaryText={group.groupNumber}
                                key={groupIndex}
                                nestedItems={[
                                    <ListItem disabled={true} key={groupIndex}>
                                        <Table selectable={false}>
                                            <TableHeader
                                                className="tableHeader"
                                                displaySelectAll={false}
                                                adjustForCheckbox={false}
                                            >
                                            {/* Header containing tag value names*/}
                                                <DicomTableHeader />
                                            </TableHeader>
                                            <TableBody selectable={false} displayRowCheckbox={false}>

                                                {group.entries.map((entry, entryIndex) => {
                                                    return (
                                                        // single row with single DicomEntry
                                                        <DicomTableRow entry={entry} key={entryIndex} />

                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
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
