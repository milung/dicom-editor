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

            switch (changeType) {
                case ChangeType.EDIT:
                    this.updateDicomTag(currentFile.dicomData, newEntry);
                    this.reducer.updateCurrentFile(currentFile);
                    break;
            
                default:
                    break;
            }
            
        }
    }

    public updateDicomTag(dicomData: DicomSimpleData, newEntry: DicomEntry) {
        let index = -1;
        dicomData.entries.map((entry, i) => {
            if (entry.id === newEntry.id) {
                index = i;
            }
        });

        if (index > -1) {
            dicomData.entries[index] = newEntry;
        }
    }
}