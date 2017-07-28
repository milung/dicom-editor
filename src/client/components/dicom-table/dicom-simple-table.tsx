import * as React from 'react';
import { DicomEntry } from '../../model/dicom-entry';
import { DicomTableHeader } from './dicom-table-header';
import { DicomTableRow } from './dicom-table-row';
import { TableHeader, Table, TableBody } from 'material-ui';

export interface DicomSimpleTableProps {
    entries: DicomEntry[];
    
}

export interface DicomSimpleTableState {

}

// This component displays a table of all entries belonging to a single module
export class DicomSimpleTable extends React.Component<DicomSimpleTableProps, DicomSimpleTableState> {
    public constructor(props: DicomSimpleTableProps) {
        super(props);
    }

    public render() {
        return (
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

                        {this.props.entries.map((entry, entryIndex) => {
                            return (
                                // single row with single DicomEntry
                                <DicomTableRow entry={entry} key={entryIndex} shouldShowTag={true}/>

                            );
                        })}
                    </TableBody>
                </Table>
        );
    }
}