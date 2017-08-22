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
    entryBeingEdited?: DicomEntry;
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

        this.handleExitEditingClick = this.handleExitEditingClick.bind(this);
    }

    public render() {

        return (
            <Table selectable={false} headerStyle={{ backgroundColor: '#009999' }}>

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
                            key={dasKey + Math.random()}
                            handleClick={() => this.handleSequenceClick(entry)}
                            margin={(20 * (depth + 1)).toString() + 'px'}
                            expanded={this.state.expandedSequences[entry.tagGroup + entry.tagElement]}
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
                            key={dasKey + Math.random()}
                            shouldShowTag={true}
                            margin={(20 * (depth + 1)).toString() + 'px'}
                            editMode={this.state.entryBeingEdited === entry}
                            handleEnterEditing={() => { this.handleEditEntryClick(entry); }}
                            handleExitEditing={this.handleExitEditingClick}
                            handleDeletingEntry={() => { this.handleDeletingRow(entry); }}
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

    private handleEditEntryClick(entry: DicomEntry) {
        this.setState({
            entryBeingEdited: entry
        });
    }

    private handleExitEditingClick(newEntry: DicomEntry) {
        console.log(newEntry);
        this.setState({
            entryBeingEdited: undefined
        });
    }

    private handleDeletingRow(entry: DicomEntry) {
        console.log('deleting:');
        console.log(entry);
    }
}