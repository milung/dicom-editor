import { DicomSimpleData, DicomEntry } from '../model/dicom-entry';
import { SelectedFile } from '../application-state';

export function compareTwoFiles(file1: SelectedFile, file2: SelectedFile): DicomSimpleData {
    let comparisonEntries: DicomSimpleData = { entries: [] };

    let fileMap2 = file2.selectedFile.dicomData.entries.reduce(function (map: {}, obj: DicomEntry) {
        map[obj.tagGroup + obj.tagElement] = obj;
        return map;
    },
                                                               {});

    let commonMap = {};
    file1.selectedFile.dicomData.entries.map((entry, index) => {
        if (fileMap2[entry.tagGroup + entry.tagElement]) {
            let entry2: DicomEntry = fileMap2[entry.tagGroup + entry.tagElement];
            let tempEntry1: DicomEntry = {
                tagGroup: entry.tagGroup,
                tagElement: entry.tagElement,
                tagName: entry.tagName,
                tagValue: entry.tagValue,
                tagVR: entry.tagVR,
                tagVM: entry.tagVM,
                colour: entry.colour
            };

            let tempEntry2: DicomEntry = {
                tagGroup: entry2.tagGroup,
                tagElement: entry2.tagElement,
                tagName: entry2.tagName,
                tagValue: entry2.tagValue,
                tagVR: entry2.tagVR,
                tagVM: entry2.tagVM,
                colour: entry2.colour
            };

            if (tempEntry1.tagValue !== tempEntry2.tagValue) {
                tempEntry1.colour = file1.colour;
                tempEntry2.colour = file2.colour;
                // shorterEntry.tagGroup = shorterEntry.tagElement = "";

                commonMap[tempEntry1.tagGroup + tempEntry1.tagElement] = [tempEntry1, tempEntry2];
            }
        }
    });

    file2.selectedFile.dicomData.entries.forEach(entry => {
        if (commonMap[entry.tagGroup + entry.tagElement] === undefined) {
            commonMap[entry.tagGroup + entry.tagElement] = [
                {
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: entry.tagName,
                    tagValue: entry.tagValue,
                    tagVR: entry.tagVR,
                    tagVM: entry.tagVM,
                    colour: entry.colour
                }
            ];
        }
    });

    file1.selectedFile.dicomData.entries.forEach(entry => {
        if (commonMap[entry.tagGroup + entry.tagElement] === undefined) {
            commonMap[entry.tagGroup + entry.tagElement] = [
                {
                    tagGroup: entry.tagGroup,
                    tagElement: entry.tagElement,
                    tagName: entry.tagName,
                    tagValue: entry.tagValue,
                    tagVR: entry.tagVR,
                    tagVM: entry.tagVM,
                    colour: entry.colour
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
