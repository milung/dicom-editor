import { DicomEntry } from '../model/dicom-entry';
import { dicomDictionary } from './dicom-dictionary';
import { convertFileToArrayBuffer } from './file-converter';
import { translateTagGroup } from './group-name-translator';
import { DicomGroupEntry, DicomData } from "../model/dicom-group-entry";

var dicomParser = require('dicom-parser');

export class DicomReader {

    public getData(file: File): Promise<DicomData> {
        return new Promise<DicomData>((resolve, reject) => {
            convertFileToArrayBuffer(file).then(arrayBuffer => {
                this.getDicomEntries(arrayBuffer).then(entries => {
                    resolve(entries);
                });
            });
        });
    }

    public getDicomEntries(bytes: Uint8Array): Promise<DicomData> {
        return new Promise<DicomData>((resolve, reject) => {
            let data: DicomData = {};
            setTimeout(
                function () {
                    var dataset;
                    try {
                        dataset = dicomParser.parseDicom(bytes);

                        for (var tag in dataset.elements) {
                            if (tag) {

                                var value = dataset.string(tag, undefined);

                                var firstHalf: string = tag.slice(1, 5);
                                var latterHalf: string = tag.slice(5, 9);

                                let subdict = dicomDictionary[firstHalf];
                                if (subdict === undefined) {
                                    continue;
                                }

                                let dictResult: string = subdict[latterHalf];
                                if (dictResult === undefined) {
                                    continue;
                                }

                                let entry: DicomEntry = {
                                    tagGroup: firstHalf,
                                    tagElement: latterHalf,
                                    tagName: dictResult,
                                    tagValue: value
                                };

                                // if tag group already exists, add new entry to it
                                if (data[firstHalf]) {
                                    data[firstHalf].entries.push(entry);
                                } else { // else create new group entry
                                    let groupEntry: DicomGroupEntry = {

                                        groupName: translateTagGroup(firstHalf),
                                        groupNumber: firstHalf,
                                        entries: [
                                            entry
                                        ]
                                    }
                                    data[firstHalf] = groupEntry;
                                }

                            }
                        }
                    } catch (err) {
                        var message = err;
                        if (err.exception) {
                            message = err.exception;
                        }
                    }
                    resolve(data);
                },
                10);
        });
    }
}