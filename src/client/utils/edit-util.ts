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

            // TODO if already id is here, only update not push
            currentFile.unsavedChanges.push(change);
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
    let index = findIndexForEntryId(dicomData, newEntry.id);

    if (index > -1) {
        dicomData.entries[index] = newEntry;
    }
}

export function removeDicomTag(dicomData: DicomSimpleData, entry: DicomEntry) {
    let index = findIndexForEntryId(dicomData, entry.id);

    if (index > -1) {
        dicomData.entries.splice(index, 1);
    }
}

function findIndexForEntryId(dicomData: DicomSimpleData, id: number): number {
    let index = -1;
    dicomData.entries.map((entry, i) => {
        if (entry.id === id) {
            index = i;
        }
    });
    return index;
}
