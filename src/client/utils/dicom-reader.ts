import { DicomEntry } from '../model/dicom-entry';
import { dicomDictionary } from './dicom-dictionary';
import { convertFileToArrayBuffer } from './file-converter';
// import { translateTagGroup } from './group-name-translator';
import { DicomSimpleData } from '../model/dicom-entry';

import * as dicomParser from 'dicom-parser';

// interface Dataset {
//     byteArray: any;
//     byteArrayParser: any;
//     elements: any;
//     warnings: any;
//     string(a: any,b: any): any;
//     text(a: any,b: any): any;
//     float(a: any,b: any): any;
//     double(a: any,b: any): any;
//     uint16(a: any,b: any): any;
//     uint32(a: any,b: any): any;
//     uint32(a: any,b: any): any;
//     int16(a: any,b: any): any;
//     int32(a: any,b: any): any;
//     attributeTag(a: any): any            
// };

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
        return value === undefined ? 0 : (value.toString().match(/\\/g) || []).length + 1;
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

            let freshData = this.createEntries(dataset);
            data.entries = data.entries.concat(freshData.entries);

        } catch (err) {
            var message = err;
            if (err.exception) {
                message = err.exception;
            }
            throw err;
        }
        return data;
    }

    /**
     * @description Computes number of frames in Dicom
     * @param {Uint8Array} data data to find frames in
     * @returns {number} number of frames in Dicom data, or 0 if data is empty
     */
    public getNumberOfFrames(data: Uint8Array): number {
        if (data.length === 0) {
            return 0;
        }
        let dataset;
        dataset = dicomParser.parseDicom(data);
        let numFrames = dataset.intString('x00280008');
        // if number of frame tag is undefined, try to display frame 1
        return numFrames === undefined ? 1 : numFrames;
    }

    /**
     * @description creates DicomSimpleData with respect to VR 
     * @param dataset raw data containing information
     * @return {DicomSimpleData} that is ready for table
     */
    // tslint:disable-next-line
    private createEntries(dataset: any): DicomSimpleData { 
        let data: DicomSimpleData = {
            entries: []
        };
        for (var tag in dataset.elements) {
            if (!tag) {
                continue;
            }
            const tagElement = dataset.elements[tag];
            const firstHalf: string = tag.slice(1, 5);
            const latterHalf: string = tag.slice(5, 9);

            let value;
            let tempSequence: DicomEntry[] = [];
            if (tagElement.vr === 'AE' || tagElement.vr === 'CS' ||
                tagElement.vr === 'SH' || tagElement.vr === 'LO') {
                value = dataset.string(tag, undefined);
            } else if (tagElement.vr === 'UT' || tagElement.vr === 'ST' ||
                tagElement.vr === 'LT') {
                value = dataset.text(tag, undefined);
            } else if (tagElement.vr === 'FD') {
                value = dataset.double(tag, undefined);
            } else if (tagElement.vr === 'FL') {
                value = dataset.float(tag, undefined);
            } else if (tagElement.vr === 'UL') {
                value = dataset.uint32(tag, undefined);
            } else if (tagElement.vr === 'US') {
                value = dataset.uint16(tag, undefined);
            } else if (tagElement.vr === 'SS') {
                value = dataset.int16(tag, undefined);
            } else if (tagElement.vr === 'AT') {
                value = dataset.attributeTag(tag);
                value = '(' + value.slice(1, 5) + ', ' + value.slice(5, 9) + ')';

            } else if (tagElement.vr === 'SQ') {
                for (var i = 0; i < tagElement.items.length; i++) {
                    tempSequence = tempSequence.concat(this.createEntries(
                        tagElement.items[i].dataSet).entries);
                }

            } else if (tagElement.vr === 'SL') {
                value = dataset.int32(tag, undefined);
            } else {
                value = dataset.string(tag, undefined);
            }
            const VM = this.getValueMultiplicity(value);

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
                colour: '#000000',
                sequence: tempSequence
            };

            data.entries.push(entry);

        }
        return data;
    }

}