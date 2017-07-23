import * as React from 'react';
import {
    Table,
    List,
    ListItem,
    TableBody,
    TableHeader,
} from 'material-ui';
import { DicomExtendedData, DicomEntry } from '../../model/dicom-entry';
import './dicom-table.css';
import { DicomTableRow } from './dicom-table-row';
import { DicomTableHeader } from './dicom-table-header';

interface TableData {
    entries: DicomEntry[];
    moduleName: string;
}

interface DicomTableProps {
    data: DicomExtendedData;
}

interface DicomTableState {
}

export class DicomTable extends React.Component<DicomTableProps, DicomTableState> {

    constructor(props: DicomTableProps) {
        super(props);
    }

    render() {
        let moduleArray: TableData[] = [];
        // let keyCounter = 0;
        if (this.props.data) {

            for (var moduleName in this.props.data) {
                if (moduleName) {
                    let data: TableData = {
                        entries: this.props.data[moduleName],
                        moduleName: moduleName
                    };
                    moduleArray.push(data);
                }
            }
            return (
                <List>
                    {/* iterates over modules */}
                    { moduleArray.map((module, moduleIndex) => {
                        return (
                            <ListItem
                                primaryText={module.moduleName}
                                key={moduleIndex}
                                nestedItems={[
                                    <ListItem disabled={true} key={moduleIndex}>
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

                                                {module.entries.map((entry, entryIndex) => {
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
