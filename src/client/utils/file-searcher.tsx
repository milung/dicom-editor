import { ApplicationStateReducer } from '../application-state';
import { DicomEntry, DicomSimpleData } from '../model/dicom-entry';

export class FileSearcher {
    constructor(private reducer: ApplicationStateReducer) { }

    public searchFile(): DicomSimpleData {
        let searchExpression = this.reducer.getState().searchExpression;
        let searchFile = this.reducer.getState().currentFile;

        if (searchFile) {
            let data = searchFile.dicomData;
            return this.findResultsOfSearch(searchExpression, data);
        }
        return {entries: []};
    }

    private findResultsOfSearch(searchExpression: string, dicomData: DicomSimpleData): DicomSimpleData {
        let matchedRows: DicomEntry[] = [];
        let data = dicomData.entries;

        data.forEach(row => {
            let searching = new RegExp(searchExpression, 'i');

            if (row.tagElement.search(searching) !== -1 || row.tagGroup.search(searching) !== -1 ||
                row.tagName.search(searching) !== -1) {
                matchedRows.push(row);
            }
        });

        return {entries: matchedRows};
    }
}