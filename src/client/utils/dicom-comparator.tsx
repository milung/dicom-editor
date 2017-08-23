import { DicomEntry, DicomSimpleComparisonData, DicomComparisonData } from '../model/dicom-entry';
// import { SelectedFile } from '../model/file-interfaces';

function createEntryCopy(entry: DicomEntry): DicomEntry {
    let entryCopy: DicomEntry = {
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

export function compareTwoFiles(
    entries1: DicomEntry[],
    color1: string,
    entries2: DicomEntry[],
    color2: string): DicomSimpleComparisonData {
    let comparisonEntries: DicomSimpleComparisonData = { dicomComparisonData: [] };

    let fileMap2 = entries2.reduce(function (map: {}, obj: DicomEntry) {
        map[obj.tagGroup + obj.tagElement] = obj;
        return map;
    },
                                   {});

    let commonMap = {};
    entries1.map((entry, index) => {
        // If one tag from first file is in the second file
        if (fileMap2[entry.tagGroup + entry.tagElement]) {
            // create copies of both entries
            let entry2: DicomEntry = fileMap2[entry.tagGroup + entry.tagElement];

            let tempEntry1 = createEntryCopy(entry);

            let tempEntry2 = createEntryCopy(entry2);

            if (tempEntry1.tagValue !== tempEntry2.tagValue) { // check if they contain the same value
                tempEntry1.colour = color1;
                tempEntry2.colour = color2;

                commonMap[tempEntry1.tagGroup + tempEntry1.tagElement] = [tempEntry1, tempEntry2];

                if (tempEntry1.sequence !== undefined && tempEntry1.sequence.length > 0 &&
                    tempEntry2.sequence !== undefined && tempEntry2.sequence.length > 0
                ) {

                    let comparedSequences = compareTwoFiles(
                        tempEntry1.sequence,
                        color1,
                        tempEntry2.sequence,
                        color2);
                    let comparisonData = {
                        group: [tempEntry1, tempEntry2],
                        tagGroup: tempEntry1.tagGroup,
                        tagElement: tempEntry1.tagElement,
                        sequence: comparedSequences.dicomComparisonData
                    };
                    comparisonEntries.dicomComparisonData.push(comparisonData);

                } else {
                    let comparisonEntry: DicomComparisonData = {
                        tagGroup: tempEntry1.tagGroup,
                        tagElement: tempEntry1.tagElement,
                        group: [tempEntry1, tempEntry2]
                    };
                    comparisonEntries.dicomComparisonData.push(comparisonEntry);
                }

            } else { // just once with black color
                commonMap[tempEntry1.tagGroup + tempEntry1.tagElement] = [tempEntry1];
                if (tempEntry1.sequence !== undefined && tempEntry1.sequence.length > 0) {

                    let comparedSequences = compareTwoFiles(
                        tempEntry1.sequence,
                        color1,
                        tempEntry2.sequence,
                        color2);
                    let comparisonData = {
                        group: [tempEntry1],
                        tagGroup: tempEntry1.tagGroup,
                        tagElement: tempEntry1.tagElement,
                        sequence: comparedSequences.dicomComparisonData
                    };
                    comparisonEntries.dicomComparisonData.push(comparisonData);
                } else {
                    let comparisonEntry: DicomComparisonData = {
                        tagGroup: tempEntry1.tagGroup,
                        tagElement: tempEntry1.tagElement,
                        group: [tempEntry1]
                    };
                    comparisonEntries.dicomComparisonData.push(comparisonEntry);
                }

            }
        }
    });

    entries2.forEach(entry => {
        if (commonMap[entry.tagGroup + entry.tagElement] === undefined) {
            let entries = [

                {
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: entry.tagName,
                    tagValue: entry.tagValue,
                    tagVR: entry.tagVR,
                    tagVM: entry.tagVM,
                    colour: color2,
                    sequence: entry.sequence
                },
                {
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: 'Missing name',
                    tagValue: 'Missing value',
                    tagVR: '',
                    tagVM: '',
                    colour: color1,
                    sequence: []
                }
            ];
            let comparisonEntry: DicomComparisonData = {
                group: entries,
                tagGroup: entries[0].tagGroup,
                tagElement: entries[0].tagElement,
                sequence: []
            };
            comparisonEntries.dicomComparisonData.push(comparisonEntry);
        }
    });

    entries1.forEach(entry => {
        if (commonMap[entry.tagGroup + entry.tagElement] === undefined) {
            let entries: DicomEntry[] = [
                {
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: entry.tagName,
                    tagValue: entry.tagValue,
                    tagVR: entry.tagVR,
                    tagVM: entry.tagVM,
                    colour: color1,
                    sequence: entry.sequence
                },
                {
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: 'Missing name',
                    tagValue: 'Missing value',
                    tagVR: '',
                    tagVM: '',
                    colour: color2,
                    sequence: []
                }
            ];
            let comparisonEntry: DicomComparisonData = {
                group: entries,
                tagGroup: entries[0].tagGroup,
                tagElement: entries[0].tagElement,
                sequence: []
            };
            comparisonEntries.dicomComparisonData.push(comparisonEntry);
        }
    });

    // for (var key in commonMap) {
    //     if (key) {
    //         var entries: DicomEntry[];
    //         entries = commonMap[key];
    //         if (entries) {
    //             let comparisonEntry: DicomComparisonData = {
    //                 tagGroup: entries[0].tagGroup,
    //                 tagElement: entries[0].tagElement,
    //                 group: entries
    //             };
    //             if (commonMap[key].dicomComparisonData !== undefined &&
    //                 commonMap[key].dicomComparisonData.sequence.length > 0) {
    //                 comparisonEntry.sequence = commonMap[key].dicomComparisonData.sequence;
    //             }
    //             comparisonEntries.dicomComparisonData.push(comparisonEntry);
    //         }
    //     }

    // }

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
