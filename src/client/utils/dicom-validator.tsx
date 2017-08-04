import { DicomSimpleData } from '../model/dicom-entry';

/**
 * @description checks if file contains image or no
 * @param dicomData data to be checked
 */
export function containsImage(dicomData: DicomSimpleData): boolean {
    let result: boolean = false;
    dicomData.entries.forEach((entry) => {
        if (entry !== undefined
            && entry.tagVR === 'OW'
            && entry.tagName === 'Pixel Data'
            && entry.tagValue.length > 0) {
            result = true;
        }
    });
    return result;
}

/**
 * @description checks if file has multiframe images
 * @param dicomData data to be checked
 */
export function isMultiframe(dicomData: DicomSimpleData): boolean {
    let result: boolean = false;
    dicomData.entries.forEach((entry) => {
        if (entry !== undefined
            && entry.tagVR === 'IS'
            && entry.tagName === 'Number of Frames'
            && parseInt(entry.tagValue, 10) > 1) {
            result = true;
        }
    });
    return result;
}