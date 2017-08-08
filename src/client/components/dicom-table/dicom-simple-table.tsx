import * as React from 'react';
import { DicomEntry } from '../../model/dicom-entry';
import { DicomTableHeader } from './dicom-table-header';
import { DicomTableRow } from './dicom-table-row';
import { TableHeader, Table, TableBody } from 'material-ui';
import { DicomSequenceRow } from './dicom-sequence-row';

export interface DicomSimpleTableProps {
    entries: DicomEntry[];
}

export interface DicomSimpleTableState {
    expandedSequences: {};
}

// This component displays a table of all entries belonging to a single module
export class DicomSimpleTable extends React.Component<DicomSimpleTableProps, DicomSimpleTableState> {

    public constructor(props: DicomSimpleTableProps) {
        super(props);
        this.state = {
            expandedSequences: { '': false }
        };
        this.props.entries.forEach((entry) => {
            if (entry.sequence.length > 0) {
                this.state.expandedSequences[entry.tagGroup + entry.tagElement] = false;
            }
        });
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

        return entries.reduce(
            (arr: JSX.Element[], entry, entryIndex) => {

                let dasKey = ((depth + 1) * 100000 + (entryIndex));

                if (entry.sequence.length > 0) {
                    arr.push(
                        <DicomSequenceRow
                            entry={entry}
                            key={dasKey}
                            handleClick={() => this.handleSequenceClick(entry)}
                        />
                    );

                    if (this.state.expandedSequences[entry.tagGroup + entry.tagElement]) {
                        this.getEntryRows(entry.sequence, depth + 1).forEach((row, ind) => arr.push(row));
                    }

                } else {
                    // single row with single DicomEntry 
                    arr.push(
                        <DicomTableRow
                            entry={entry}
                            key={dasKey}
                            shouldShowTag={true}
                            margin={(25 * depth).toString() + 'px'}
                        />
                    );
                }

                return arr;
            },
            []);
    }

    private handleSequenceClick(entry: DicomEntry) {
        let tempDict = this.state.expandedSequences;
        if (tempDict[entry.tagGroup + entry.tagElement] === true) {
            tempDict[entry.tagGroup + entry.tagElement] = false;
        } else {
            tempDict[entry.tagGroup + entry.tagElement] = true;
        }
        this.setState({ expandedSequences: tempDict });
    }
}