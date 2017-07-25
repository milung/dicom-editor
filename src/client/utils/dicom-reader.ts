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
        let dataset;
        try {
            dataset = dicomParser.parseDicom(bytes);

            for (var tag in dataset.elements) {
                if (tag) {
                    const tagElement = dataset.elements[tag];

                    const value = dataset.string(tag, undefined);
                    const VM = this.getValueMultiplicity(value);

                    const firstHalf: string = tag.slice(1, 5);
                    const latterHalf: string = tag.slice(5, 9);

                    const fullTag = `${firstHalf}${latterHalf}`;

                    const name = dicomDictionary[fullTag];
                    const VR = tagElement.vr;

                    let entry: DicomEntry = {
                        tagGroup: firstHalf,
                        tagElement: latterHalf,
                        // need to get second item, because of dicom dictionary structure
                        tagName: name || 'Unknown name',
                        tagValue: value,
                        tagVR: VR || 'Unknown VR',
                        tagVM: VM.toString(),
                        colourIndex: 0
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