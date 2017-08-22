import { ApplicationStateReducer } from '../application-state';
import {
    DicomEntry,
    DicomSimpleData,
    DicomComparisonData,
    DicomSimpleComparisonData
} from '../model/dicom-entry';

export class FileSearcher {
    constructor(private reducer: ApplicationStateReducer) { }

    /**
     * @description Method which search data of current file.
     * @returns {DicomSimpleData} filtered data to show.
     */
    public searchFile(): DicomSimpleData {
        let searchExpression = this.reducer.getState().searchExpression;
        let searchFile = this.reducer.getState().currentFile;

        if (searchFile) {
            let data = searchFile.dicomData;
            return { entries: this.findResultsOfSearch(searchExpression, data.entries) };
        }
        return { entries: [] };
    }

    /**
     * @description Method which run searching in compared data of files.
     * @param data represents compared data of files to be filtered.
     * @returns {DicomSimpleComparisonData} filtered data to show.
     */
    public searchCompareData(data: DicomComparisonData[]): DicomSimpleComparisonData {
        let searchExpression = this.reducer.getState().searchExpression;
        let filteredData: DicomSimpleComparisonData = { dicomComparisonData: [] };

        data.forEach(entity => {
            let filteredRows = this.findResultsOfSearch(searchExpression, entity.group);
            if (filteredRows.length > 0) {
                filteredData.dicomComparisonData.push({
                    group: filteredRows,
                    tagGroup: entity.tagGroup,
                    tagElement: entity.tagElement
                });
            }
        });

        return filteredData;
    }

    private findResultsOfSearch(searchExpression: string, data: DicomEntry[]): DicomEntry[] {
        let matchedRows: DicomEntry[] = [];

        data.forEach(row => {
            let searching = new RegExp(searchExpression, 'i');
            let tagWithoutComma = row.tagGroup + row.tagElement;
            let tagWithComma = row.tagGroup + ', ' + row.tagElement;

            if (row && row.sequence && row.sequence.length >= 1) {
                let res = this.findResultsOfSearch(searchExpression, row.sequence);
                if (res.length > 0) {
                    let result: DicomEntry = {
                        tagGroup: row.tagGroup,
                        tagElement: row.tagElement,
                        tagName: row.tagName,
                        tagValue: row.tagValue,
                        tagVR: row.tagVR,
                        tagVM: row.tagVM,
                        colour: row.colour,
                        sequence: res
                    };
                    matchedRows.push(result);
                }
            }
            
            if (row.tagName.search(searching) !== -1 || tagWithoutComma.search(searching) !== -1 ||
                tagWithComma.search(searching) !== -1) {
                matchedRows.push(row);
            }
        });

        return matchedRows;
    }
}