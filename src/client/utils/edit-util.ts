import { HeavyweightFile } from './../model/file-interfaces';
import { EditTags, ChangeType } from './../model/edit-interface';
import { DicomEntry, DicomSimpleData } from './../model/dicom-entry';
import { ApplicationStateReducer } from './../application-state';

export class EditUtil {

    public constructor(private reducer: ApplicationStateReducer) {
    }

    public applyChangeToCurrentFile(newEntry: DicomEntry, changeType: ChangeType) {
        let currentFile = this.reducer.getState().currentFile;

        if (currentFile) {
            let change: EditTags = {
                entry: newEntry,
                type: changeType
            };

            if (!currentFile.unsavedChanges) {
                currentFile.unsavedChanges = [];
            }

            // check if file already has unsaved change of this dicom entry
            let index = -1;
            currentFile.unsavedChanges.map((unsavedChange, i) => {
                if (unsavedChange.entry.id === newEntry.id) {
                    index = i;
                }
            });

            // if already id is here, only update not push
            if (index > -1) {
                currentFile.unsavedChanges[index] = change;
            } else {
                currentFile.unsavedChanges.push(change);
            }

            this.reducer.updateCurrentFile(currentFile);
        }
    }

}

export function applyChangesForDisplay(heavyFile: HeavyweightFile): DicomSimpleData {
    if (heavyFile.unsavedChanges === undefined) {
        return heavyFile.dicomData;
    }

    let result: DicomSimpleData = JSON.parse(JSON.stringify(heavyFile.dicomData));

    heavyFile.unsavedChanges.forEach((change) => {
        switch (change.type) {
            case ChangeType.EDIT:
                updateDicomTag(result, change.entry);
                break;

            case ChangeType.REMOVE:
                removeDicomTag(result, change.entry);
                break;

            default:
                break;
        }
    });

    return result;
}

export function updateDicomTag(dicomData: DicomSimpleData, newEntry: DicomEntry) {
    let entryToUpdate = findEntryById(dicomData, newEntry.id);

    applyChangedValues(entryToUpdate, newEntry);
}

export function removeDicomTag(dicomData: DicomSimpleData, entry: DicomEntry) {
    let index = findIndexForEntryId(dicomData, entry.id);

    if (index > -1) {
        dicomData.entries.splice(index, 1);
    }
}

/**
 * @description Tries to find entry that is to be updated. Finds reference from dicom data. Searches
 * also in sequences.
 * @param {DicomSimpleData} dicomData data to find reference on entry in by id.
 * @param {number} id id to search for
 * @returns {(DicomEntry | undefined)} reference on entry that matches given id or undefined if no entry
 * was found.
 */
export function findEntryById(dicomData: DicomSimpleData, id: number): DicomEntry | undefined {
    let resultEntry: DicomEntry | undefined = undefined;
    dicomData.entries.forEach((entry, index) => {
        if (entry !== undefined) {
            if (entry.id === id) {
                resultEntry = entry;
            } else {
                let recEntry = findEntryById({ entries: entry.sequence }, id);
                if (recEntry) {
                    resultEntry = recEntry;
                }
            }
        }

    });

    return resultEntry;
}

export function findIndexForEntryId(dicomData: DicomSimpleData, id: number): number {
    let index = -1;
    dicomData.entries.map((entry, i) => {
        if (entry.id === id) {
            index = i;
        }
    });
    return index;
}

function applyChangedValues(entryToUpdate: DicomEntry | undefined, newEntry: DicomEntry) {
    if (entryToUpdate) {
        entryToUpdate.tagValue = newEntry.tagValue;
        entryToUpdate.tagVR = newEntry.tagVR;
        entryToUpdate.tagVM = newEntry.tagVM;
    }
}
