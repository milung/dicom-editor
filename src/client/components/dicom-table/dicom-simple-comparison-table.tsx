import * as React from 'react';
import { DicomEntry, DicomComparisonData } from '../../model/dicom-entry';
import { DicomTableHeader } from './dicom-table-header';
import { TableHeader, Table, TableBody } from 'material-ui';
import { DicomTableRow } from './dicom-table-row';
import { DicomSequenceRow } from './dicom-sequence-row';
// import { DicomSequenceRow } from "./dicom-sequence-row";

export interface DicomSimpleComparisonTableProps {
    comparisonData: DicomComparisonData[];
    showOnlyDiffs: boolean;
}

export interface DicomSimpleComparisonTableState {
    expandedSequences: {};
}

// This component displays a table of all entries belonging to a single module
export class DicomSimpleComparisonTable extends React.Component<
    DicomSimpleComparisonTableProps,
    DicomSimpleComparisonTableState> {
    public constructor(props: DicomSimpleComparisonTableProps) {
        super(props);
        this.state = {
            expandedSequences: { '': false }
        };
        this.props.comparisonData.forEach((entry) => {
            if (entry.group[0].sequence !== undefined && entry.group[0].sequence.length > 0) {
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

                    {this.getEntryRows(this.props.comparisonData, 0)}

                </TableBody>
            </Table>
        );
    }

/**
 * @description function used to return an array of rows with entries, necessary for sequence rows
 * @param entries entries to be shown in the table
 * @param depth used to generate unique keys since function can be called recursively
 */
    private getEntryRows(entries: DicomComparisonData[], depth: number): JSX.Element[] {
        return entries.reduce((

            arr: JSX.Element[], group, groupIndex) => {
            let dasKey = ((depth + 1) * 100000 + (groupIndex));
            {/* if header, print once*/ }
            if (group.group.length > 1) {
                let entryHeader: DicomEntry = {
                    tagGroup: group.group[0].tagGroup,
                    tagElement: group.group[0].tagElement,
                    tagName: '',
                    tagValue: '',
                    tagVR: '',
                    tagVM: '',
                    colour: '#000000',
                    sequence: []
                };
                arr.push(
                    <DicomTableRow
                        entry={entryHeader}
                        shouldShowTag={true}
                        key={dasKey + Math.random()}
                        margin={(20 * (depth + 1)).toString() + 'px'}
                    />
                );

                if (this.isSequence(group)) {
                    arr.push(
                        <DicomSequenceRow
                            entry={group.group[0]}
                            key={dasKey + Math.random()}
                            handleClick={() => this.handleSequenceClick(group.group[0])}
                            margin={(20 * (depth + 1)).toString() + 'px'}
                            expanded={this.state.expandedSequences[group.group[0].tagGroup + group.group[0].tagElement]}
                        />
                    );

                    if (group.sequence !== undefined &&
                        this.state.expandedSequences[group.group[0].tagGroup + group.group[0].tagElement]) {
                        this.getEntryRows(group.sequence, depth + 1).forEach((row, ind) => arr.push(row));
                    }
                }

                group.group.map((entry, entryIndex) => {

                    arr.push(

                        <DicomTableRow
                            entry={entry}
                            shouldShowTag={false}
                            key={entryIndex + 1000 * (dasKey + 1)}
                            margin={(20 * (depth + 1)).toString() + 'px'}
                        />
                    );
                });

            } else if ((group.group.length === 1 && !this.props.showOnlyDiffs) ||
                (group.sequence !== undefined && group.sequence.length > 1)) {
                // should render sequence header
                if (this.isSequence(group) && group.sequence !== undefined && this.atLeastOneDifference(group.sequence)
                    || !this.props.showOnlyDiffs && this.isSequence(group)) {

                    arr.push(
                        <DicomSequenceRow
                            entry={group.group[0]}
                            key={dasKey + Math.random()}
                            handleClick={() => this.handleSequenceClick(group.group[0])}
                            margin={(20 * (depth + 1)).toString() + 'px'}
                            expanded={this.state.expandedSequences[group.group[0].tagGroup + group.group[0].tagElement]}
                        />
                    );
                    if (group.sequence !== undefined &&
                        this.state.expandedSequences[group.group[0].tagGroup + group.group[0].tagElement]) {
                        this.getEntryRows(group.sequence, depth + 1).forEach((row, ind) => arr.push(row));
                    }
                    // not a sequence
                } else if (!this.isSequence(group) || !this.props.showOnlyDiffs) {
                    arr.push(
                        <DicomTableRow
                            entry={group.group[0]}
                            shouldShowTag={true}
                            key={dasKey + Math.random()}
                            margin={(20 * (depth + 1)).toString() + 'px'}
                        />
                    );

                }

            }
            return arr;
        },                    []);
    }
/**
 * 
 * @param dicomData data to be checked
 * @description checks if data contains sequence. Sequences need headers to be correctly displayed
 */
    private isSequence(dicomData: DicomComparisonData) {

        return dicomData.sequence !== undefined && dicomData.sequence.length > 0;
    }
/**
 * 
 * @param dicomData data to be checked
 * @description checks if data has at least one difference. If no difference is found application should
 * hide the whole sequence if user selected that kind of option
 */
    private atLeastOneDifference(dicomData: DicomComparisonData[]) {
        let result = false;

        dicomData.forEach(sequence => {
            if (sequence.group.length > 1) {
                result = true;
            }
        });
        return result;
    }
/**
 * 
 * @param entry sequence entry
 * @description function switches between true/false in local dictionary. This dictionary is used to 
 * determine which sequences are expanded and which are collapsed
 */
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