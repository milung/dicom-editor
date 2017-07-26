import { DicomSimpleData, DicomEntry } from '../model/dicom-entry';

export function compareTwoFiles(file1: DicomEntry[], colour1: number,
                                file2: DicomEntry[], colour2: number): DicomSimpleData {
    let comparisonEntries: DicomSimpleData = { entries: [] };
    let longerFile = file1.length > file2.length ? file1 : file2;
    let shorterFile = file1.length > file2.length ? file2 : file1;
    let longerColour = file1.length > file2.length ? colour1 : colour2;
    let shorterColour = file1.length > file2.length ? colour2 : colour1;

    let shorterFileMap = shorterFile.reduce(function (map: {}, obj: DicomEntry) {
        map[obj.tagGroup + obj.tagElement] = obj;
        return map;
    },
                                            {});

    let commonMap = {};
    longerFile.map((entry, index) => {
        if (shorterFileMap[entry.tagGroup + entry.tagElement]) {
            let entry2: DicomEntry = shorterFileMap[entry.tagGroup + entry.tagElement];
            let longerEntry: DicomEntry = {
                tagGroup: entry.tagGroup,
                tagElement: entry.tagElement,
                tagName: entry.tagName,
                tagValue: entry.tagValue,
                tagVR: entry.tagVR,
                tagVM: entry.tagVM,
                colourIndex: entry.colourIndex
            };

            let shorterEntry: DicomEntry = {
                tagGroup: entry2.tagGroup,
                tagElement: entry2.tagElement,
                tagName: entry2.tagName,
                tagValue: entry2.tagValue,
                tagVR: entry2.tagVR,
                tagVM: entry2.tagVM,
                colourIndex: entry2.colourIndex
            };

            if (longerEntry.tagValue !== shorterEntry.tagValue) {
                longerEntry.colourIndex = longerColour;
                shorterEntry.colourIndex = shorterColour;
                // shorterEntry.tagGroup = shorterEntry.tagElement = "";

                commonMap[longerEntry.tagGroup + longerEntry.tagElement] = [longerEntry, shorterEntry];
            }
        }
    });

    longerFile.forEach(entry => {
        if (commonMap[entry.tagGroup + entry.tagElement] === undefined) {
            commonMap[entry.tagGroup + entry.tagElement] = [
                {
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: entry.tagName,
                    tagValue: entry.tagValue,
                    tagVR: entry.tagVR,
                    tagVM: entry.tagVM,
                    colourIndex: entry.colourIndex
                }
            ];
        }
    });

    shorterFile.forEach(entry => {
        if (commonMap[entry.tagGroup + entry.tagElement] === undefined) {
            commonMap[entry.tagGroup + entry.tagElement] = [
                {
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: entry.tagName,
                    tagValue: entry.tagValue,
                    tagVR: entry.tagVR,
                    tagVM: entry.tagVM,
                    colourIndex: entry.colourIndex
                }
            ];
        }
    });

    for (var key in commonMap) {
        if (key) {
            var entries: DicomEntry[];
            entries = commonMap[key];
            if (entries) {
                entries.forEach(entry => {
                    comparisonEntries.entries.push(entry);
                });
            }
        }
    }

    return comparisonEntries;
} 
