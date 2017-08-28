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
import { isValidationWithoutErrors, validateDicomEntry } from '../../utils/dicom-validator';

export interface DicomSimpleTableProps {
    entries: DicomEntry[];
    reducer: ApplicationStateReducer;
}

export interface DicomSimpleTableState {
    expandedSequences: {};
    entryBeingEdited?: DicomEntry;
    removeTagConfirmationOpen: boolean;
    exitInvalidConfirmOpen: boolean;
}

// This component displays a table of all entries belonging to a single module
export class DicomSimpleTable extends React.Component<DicomSimpleTableProps, DicomSimpleTableState> {

    private entryToProcess: DicomEntry;
    public constructor(props: DicomSimpleTableProps) {
        super(props);
        this.state = {
            expandedSequences: { '': false },
            removeTagConfirmationOpen: false,
            exitInvalidConfirmOpen: false
        };
        this.props.entries.forEach((entry) => {
            if (entry.sequence.length > 0) {
                this.state.expandedSequences[entry.tagGroup + entry.tagElement] = false;
            }
        });

        this.handleExitEditingClick = this.handleExitEditingClick.bind(this);
        this.handleConfirmConfirmDialog = this.handleConfirmConfirmDialog.bind(this);
        this.handleCancelChanges = this.handleCancelChanges.bind(this);
    }

    public render() {
        let popupText;
        let question;
        let confirmText;

        if (this.entryToProcess && this.entryToProcess.tagVR === 'SQ') {
            popupText = 'Are you sure you want to remove sequence and all tags in it?';
            question = 'Remove selected sequence?';
            confirmText = 'Remove sequence';
        } else {
            popupText = 'Are you sure you want to remove tag?';
            question = 'Remove selected tag?';
            confirmText = 'Remove tag';
        }
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

                {/* remove tag confirmation pop up  */}
                <PopUpDialog
                    handleClosePopUpDialog={() => { this.setState({ removeTagConfirmationOpen: false }); }}
                    handleCancelPopUpDialog={() => { this.setState({ removeTagConfirmationOpen: false }); }}
                    handleAction={this.handleConfirmConfirmDialog}
                    openedPopUpDialog={this.state.removeTagConfirmationOpen}
                    popUpText={popupText}
                    popUpQuestion={question}
                    popUpConfirmText={confirmText}
                />

                {/* exit editing of invalid tag confirmation pop up  */}
                <PopUpDialog
                    handleClosePopUpDialog={() => { this.setState({ exitInvalidConfirmOpen: false }); }}
                    handleCancelPopUpDialog={this.handleCancelChanges}
                    handleAction={() => { this.setState({ exitInvalidConfirmOpen: false }); }}
                    openedPopUpDialog={this.state.exitInvalidConfirmOpen}
                    popUpText={'Edited values contain errors. Do you want to cancel editing and drop changes or return to edit mode and contunie editing?'}
                    popUpQuestion={'Values contain errors'}
                    popUpConfirmText={'Return to edit mode'}
                    popUpCancelText={'Drop changes and cancel edit mode'}
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
                // let dasKey = ((depth + 1) * 100000 + (entryIndex));

                if (entry.sequence.length > 0) {
                    arr.push(
                        <DicomSequenceRow
                            entry={entry}
                            key={entry.id}
                            handleClick={() => this.handleSequenceClick(entry)}
                            margin={(20 * (depth + 1)).toString() + 'px'}
                            expanded={this.state.expandedSequences[entry.tagGroup + entry.tagElement]}
                            handleDeletingEntry={() => { this.handleDeletingRow(entry); }}
                        />
                    );

                    if (this.state.expandedSequences[entry.tagGroup + entry.tagElement]) {
                        this.getEntryRows(entry.sequence, depth + 1).forEach((row, ind) => arr.push(row));
                    }

                } else {
                    // single row with single DicomEntry 
                    let isEditMode: boolean = false;
                    if (this.state.entryBeingEdited && this.state.entryBeingEdited.id === entry.id) {
                        isEditMode = true;
                    }
                    arr.push(
                        <DicomTableRow
                            entry={entry}
                            key={entry.id}
                            shouldShowTag={true}
                            margin={(20 * (depth + 1)).toString() + 'px'}
                            editMode={isEditMode}
                            compareMode={false}
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
            entryBeingEdited: JSON.parse(JSON.stringify(entry))
        });
    }

    private handleExitEditingClick(newEntry: DicomEntry) {
        this.entryToProcess = JSON.parse(JSON.stringify(newEntry));
        let isEntryValid = isValidationWithoutErrors(validateDicomEntry(newEntry));
        if (!isEntryValid) {
            this.setState({
                exitInvalidConfirmOpen: true
            });
        } else {
            this.applyEditChange();
        }
    }

    private applyEditChange() {
        let editUtil: EditUtil = new EditUtil(this.props.reducer);
        editUtil.applyChangeToCurrentFile(this.entryToProcess, ChangeType.EDIT);
        this.setState({
            entryBeingEdited: undefined
        });
    }

    private handleCancelChanges() {
        this.setState({
            entryBeingEdited: undefined
        });
        this.setState({ exitInvalidConfirmOpen: false });
    }

    private handleDeletingRow(entry: DicomEntry) {
        this.entryToProcess = entry;
        this.setState({
            removeTagConfirmationOpen: true
        });
    }

    private handleConfirmConfirmDialog() {
        let editUtil: EditUtil = new EditUtil(this.props.reducer);
        editUtil.applyChangeToCurrentFile(this.entryToProcess, ChangeType.REMOVE);
        this.setState({
            removeTagConfirmationOpen: false
        });
    }
}