import { DicomEntry } from '../model/dicom-entry';
import { dicomDictionary } from './dicom-dictionary';
import { convertFileToArrayBuffer } from './file-converter';
// import { translateTagGroup } from './group-name-translator';
import { DicomSimpleData } from '../model/dicom-entry';

import * as dicomParser from 'dicom-parser';

export class DicomReader {

    /**
     * Converts file to array buffer and then parses Dicom data
     * @param file File object to process
     * @return DicomData object with parsed data
     */
    public getData(file: File): Promise<DicomSimpleData> {
        return convertFileToArrayBuffer(file).then(arrayBuffer => {
            return this.getDicomEntries(arrayBuffer);
        });
    }

    public getValueMultiplicity(value: string) {
        return value === undefined ? 0 : (value.match(/\\/g) || []).length + 1;
    }

    /**
     * Parses ArrayBuffer with DicomReader
     * @param bytes ArrayBuffer to parse
     * @return parsed DicomData
     */
    public getDicomEntries(bytes: Uint8Array): DicomSimpleData {
        let data: DicomSimpleData = {
            entries: []
        };
        var dataset;
        try {
            dataset = dicomParser.parseDicom(bytes);

            for (var tag in dataset.elements) {
                if (tag) {
                    var value = dataset.string(tag, undefined);
                    let VM = this.getValueMultiplicity(value);

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
                        // need to get second item, because of dicom dictionary structure
                        tagName: dictResult[1],
                        tagValue: value,
                        tagVR: dictResult[0],
                        tagVM: VM.toString()
                    };

                    data.entries.push(entry);

                }
            }
        } catch (err) {
            var message = err;
            if (err.exception) {
                message = err.exception;
            }
            throw err;
        }
        return data;
    }
}