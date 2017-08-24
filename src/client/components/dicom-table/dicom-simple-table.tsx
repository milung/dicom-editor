import * as React from 'react';
import { DicomEntry } from '../../model/dicom-entry';
import { DicomTableHeader } from './dicom-table-header';
import { DicomTableRow } from './dicom-table-row';
import { TableHeader, Table, TableBody } from 'material-ui';
import { DicomSequenceRow } from './dicom-sequence-row';
import { EditUtil } from '../../utils/edit-util';
import { ApplicationStateReducer } from '../../application-state';
import { ChangeType } from '../../model/edit-interface';
import { PopUpDialog } from '../side-bar/pop-up-dialog';

export interface DicomSimpleTableProps {
    entries: DicomEntry[];
    reducer: ApplicationStateReducer;
}

export interface DicomSimpleTableState {
    expandedSequences: {};
    entryBeingEdited?: DicomEntry;
    removeTagConfirmationOpen: boolean;
}

// This component displays a table of all entries belonging to a single module
export class DicomSimpleTable extends React.Component<DicomSimpleTableProps, DicomSimpleTableState> {

    private entryToRemove: DicomEntry;
    public constructor(props: DicomSimpleTableProps) {
        super(props);
        this.state = {
            expandedSequences: { '': false },
            removeTagConfirmationOpen: false
        };
        this.props.entries.forEach((entry) => {
            if (entry.sequence.length > 0) {
                this.state.expandedSequences[entry.tagGroup + entry.tagElement] = false;
            }
        });

        this.handleExitEditingClick = this.handleExitEditingClick.bind(this);
        this.handleConfirmConfirmDialog = this.handleConfirmConfirmDialog.bind(this);
    }

    public render() {

        return (
            <div>
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
                <PopUpDialog
                    handleClosePopUpDialog={() => { this.setState({ removeTagConfirmationOpen: false }); }}
                    handleCancelPopUpDialog={() => { this.setState({ removeTagConfirmationOpen: false }); }}
                    handleAction={this.handleConfirmConfirmDialog}
                    openedPopUpDialog={this.state.removeTagConfirmationOpen}
                    popUpText={'Are you sure you want to remove tag?'}
                    popUpQuestion={'Remove selected tag?'}
                    popUpConfirmText={'Remove tag'}
                />
            </div>

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
        let editUtil: EditUtil = new EditUtil(this.props.reducer);
        editUtil.applyChangeToCurrentFile(newEntry, ChangeType.EDIT);
        this.setState({
            entryBeingEdited: undefined
        });
    }

    private handleDeletingRow(entry: DicomEntry) {
        this.entryToRemove = entry;
        this.setState({
            removeTagConfirmationOpen: true
        });
    }

    private handleConfirmConfirmDialog() {
        let editUtil: EditUtil = new EditUtil(this.props.reducer);
        editUtil.applyChangeToCurrentFile(this.entryToRemove, ChangeType.REMOVE);
        this.setState({
            removeTagConfirmationOpen: false
        });
    }
}