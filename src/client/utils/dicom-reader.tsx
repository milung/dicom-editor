import { DicomEntry } from '../model/dicom-entry';
import { dicomDictionary } from '../DicomDictionary';
import { convertFileToArrayBuffer } from './file-converter';

var dicomParser = require('dicom-parser');

export class DicomReader {

    public getData(file: File): Promise<DicomEntry[]> {
        return new Promise<DicomEntry[]>((resolve, reject) => {
            convertFileToArrayBuffer(file).then(arrayBuffer => {
                this.getDicomEntries(arrayBuffer).then(entries => {
                    resolve(entries);
                });
            });
        });
    }

    public getDicomEntries(bytes: Uint8Array): Promise<DicomEntry[]> {
        return new Promise<DicomEntry[]>((resolve, reject) => {
            let data: DicomEntry[] = [];
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
                                    tagGroup: firstHalf, tagElement: latterHalf,
                                    tagName: dictResult, tagValue: value
                                };
                                data.push(entry);
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