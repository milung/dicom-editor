import { DicomEntry, DicomSimpleComparisonData, DicomComparisonData } from '../model/dicom-entry';
import { SelectedFile } from '../model/file-interfaces';

function createEntryCopy(entry: DicomEntry): DicomEntry {
    let entryCopy: DicomEntry = {
        id: entry.id,
        offset: entry.offset,
        byteLength: entry.byteLength,
        tagGroup: entry.tagGroup,
        tagElement: entry.tagElement,
        tagName: entry.tagName,
        tagValue: entry.tagValue,
        tagVR: entry.tagVR,
        tagVM: entry.tagVM,
        colour: entry.colour,
        sequence: entry.sequence
    };
    return entryCopy;
}

export function compareTwoFiles(file1: SelectedFile, file2: SelectedFile): DicomSimpleComparisonData {

    let comparisonEntries: DicomSimpleComparisonData = { dicomComparisonData: [] };

    let fileMap2 = file2.selectedFile.dicomData.entries.reduce(function (map: {}, obj: DicomEntry) {
        map[obj.tagGroup + obj.tagElement] = obj;
        return map;
    },
                                                               {});

    let commonMap = {};
    file1.selectedFile.dicomData.entries.map((entry, index) => {
        // If one tag from first file is in the second file
        if (fileMap2[entry.tagGroup + entry.tagElement]) {

            // create copies of both entries
            let entry2: DicomEntry = fileMap2[entry.tagGroup + entry.tagElement];

            let tempEntry1 = createEntryCopy(entry);

            let tempEntry2 = createEntryCopy(entry2);

            // check if they contain the same value
            if (tempEntry1.tagValue !== tempEntry2.tagValue) {
                tempEntry1.colour = file1.colour;
                tempEntry2.colour = file2.colour;
                // shorterEntry.tagGroup = shorterEntry.tagElement = "";

                commonMap[tempEntry1.tagGroup + tempEntry1.tagElement] = [tempEntry1, tempEntry2];

            } else {
                commonMap[tempEntry1.tagGroup + tempEntry1.tagElement] = [tempEntry1];
            }
        }
    });

    file2.selectedFile.dicomData.entries.forEach(entry => {
        if (commonMap[entry.tagGroup + entry.tagElement] === undefined) {
            commonMap[entry.tagGroup + entry.tagElement] = [
                {
                    offset: entry.offset,
                    byteLength: entry.byteLength,
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: entry.tagName,
                    tagValue: entry.tagValue,
                    tagVR: entry.tagVR,
                    tagVM: entry.tagVM,
                    colour: file2.colour
                },
                {
                    offset: entry.offset,
                    byteLength: entry.byteLength,
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: 'Missing name',
                    tagValue: 'Missing value',
                    tagVR: '',
                    tagVM: '',
                    colour: file1.colour
                }
            ];
        }
    });

    file1.selectedFile.dicomData.entries.forEach(entry => {
        if (commonMap[entry.tagGroup + entry.tagElement] === undefined) {
            commonMap[entry.tagGroup + entry.tagElement] = [
                {
                    offset: entry.offset,
                    byteLength: entry.byteLength,
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: entry.tagName,
                    tagValue: entry.tagValue,
                    tagVR: entry.tagVR,
                    tagVM: entry.tagVM,
                    colour: file1.colour
                },
                {
                    offset: entry.offset,
                    byteLength: entry.byteLength,
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: 'Missing name',
                    tagValue: 'Missing value',
                    tagVR: '',
                    tagVM: '',
                    colour: file2.colour
                }
            ];
        }
    });

    for (var key in commonMap) {
        if (key) {
            var entries: DicomEntry[];
            entries = commonMap[key];
            if (entries) {
                let comparisonEntry: DicomComparisonData = {
                    tagGroup: entries[0].tagGroup,
                    tagElement: entries[0].tagElement,
                    group: entries
                };
                comparisonEntries.dicomComparisonData.push(comparisonEntry);
            }
        }
    }

    return comparisonEntries;
}

export function areFilesExactlySame(entries: DicomComparisonData[]): boolean {
    let counter: number = 0;
    entries.forEach(entry => {
        if (entry.group[0].colour !== '#000000') {
            counter++;
        }
    });

    if (counter > 0) {
        return false;
    } else {
        return true;
    }

}
