import * as React from 'react';
import {
    Table,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    List,
    ListItem,
    TableBody,
    TableRowColumn,
} from 'material-ui';
import { DicomData, DicomGroupEntry } from '../../model/dicom-entry';
import './dicom-table.css';

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
        let tableRowStyle = { color: '#FFFFFF' };
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
                                            </TableHeader>
                                        </Table>
                                        {/* iterates over group entries*/}
                                        {group.entries.map((entry, entryIndex) => {
                                            return (
                                                <Table selectable={false} key={entryIndex}>
                                                    <TableHeader displaySelectAll={false} adjustForCheckbox={false} />
                                                    <TableBody selectable={false} displayRowCheckbox={false}>
                                                        <TableRow>
                                                            <TableRowColumn>
                                                                {entry.tagGroup}{', '}{entry.tagElement}
                                                                </TableRowColumn>
                                                            <TableRowColumn>{entry.tagName}</TableRowColumn>
                                                            <TableRowColumn>{entry.tagValue}</TableRowColumn>
                                                            <TableRowColumn>{entry.tagVR}</TableRowColumn>
                                                            <TableRowColumn>{entry.tagVM}</TableRowColumn>
                                                        </TableRow>
                                                    </TableBody>
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
