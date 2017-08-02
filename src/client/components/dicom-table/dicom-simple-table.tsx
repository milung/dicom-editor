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

                    {this.getEntryRows(this.props.entries, 0)}

                </TableBody>
            </Table>
        );
    }
/**
 * @description function used to return an array of rows with entries, necessary for sequence rows
 * @param entries entries to be shown in the table
 * @param depth used to generate unique keys since function can be called recursively
 */
    private getEntryRows(entries: DicomEntry[], depth: number): JSX.Element[] {

        return entries.reduce((arr: JSX.Element[], entry, entryIndex) => {

            if (entry.sequence !== undefined) { 
                // for each sequence entry modify tag to separate sequence tags from ordinary ones
                for (var i = 0; i < entry.sequence.length; i++) {
                    // prevent from adding multiple sequence delimiters
                    if (entry.sequence[i].tagGroup.length === 4) {   
                    entry.sequence[i].tagGroup = ' > ' + entry.sequence[i].tagGroup;
                }
                }

                arr.push(
                <DicomTableRow 
                    entry={entry} 
                    key={entryIndex + (10000 * (depth + 1 ) )} 
                    shouldShowTag={true} 
                />);
                arr = arr.concat(this.getEntryRows(entry.sequence, depth + 1));
            } else {

                // single row with single DicomEntry
                arr.push(<DicomTableRow entry={entry} key={entryIndex + (10000 * (depth + 1))} shouldShowTag={true} />);
            }
            return arr;
        },                    []);
    }
}