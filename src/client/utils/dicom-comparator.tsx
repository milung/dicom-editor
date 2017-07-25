import { DicomSimpleData, DicomEntry } from "../model/dicom-entry";

export function compareTwoFiles(file1: DicomEntry[], colour1: number, file2: DicomEntry[], colour2: number): DicomSimpleData {
    let comparisonEntries: DicomSimpleData = { entries: [] };
    let longerFile = file1.length > file2.length ? file1 : file2;
    let shorterFile = file1.length > file2.length ? file2 : file1;
    let longerColour = file1.length > file2.length ? colour1 : colour2;
    let shorterColour = file1.length > file2.length ? colour2 : colour1;

    let shorterFileMap = shorterFile.reduce(function (map, obj) {
        map[obj.tagGroup + obj.tagElement] = obj;
        return map;
    }, {});

    longerFile.map((entry, index) => {
        if (shorterFileMap[entry.tagGroup + entry.tagElement]) {
            let entry2: DicomEntry = shorterFileMap[entry.tagGroup + entry.tagElement];

            if (entry.tagValue === entry2.tagValue) {
                comparisonEntries.entries.push(entry);
            } else {
                entry.colourIndex = longerColour;
                entry2.colourIndex = shorterColour;
                entry2.tagGroup = entry2.tagElement = "";

                comparisonEntries.entries.push(entry);
                comparisonEntries.entries.push(entry2);
            }
        }
    })

    return comparisonEntries;
} 
