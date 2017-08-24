import { DicomSimpleData, DicomEntry } from '../model/dicom-entry';

const SUPPORTED_VR = [
    'AE',
    'CS',
    'SH',
    'LO',
    'UT',
    'ST',
    'LT',
    'FD',
    'FL',
    'UL',
    'US',
    'SS',
    'AT',
    'SQ',
    'SL',

    'AS',
    'DA',
    'DS',
    'IS',
    'OB',
    'OD',
    'OF',
    'OW',
    'PN',
    'UI',
    'UN'
];

export enum ErrorType {
    INVALID_VR,
    VALUE_NOT_MATCH_VR
}

export interface ValidationResult {
    tagValueErrors: ErrorType[];
    tagVRErrors: ErrorType[];
}

/**
 * @description checks if file contains image or no
 * @param dicomData data to be checked
 */
export function containsImage(dicomData: DicomSimpleData): boolean {
    let result: boolean = false;
    dicomData.entries.forEach((entry) => {
        if (entry !== undefined
            && (entry.tagVR === 'OB' || entry.tagVR === 'OW')
            && entry.tagName === 'Pixel Data') {
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

/**
 * @description Checks if given VR is valid
 * @param {string} vrToCheck VR that is to be checked
 * @returns {boolean} TRUE if given VR is supported by DICOM standard, 
 * FALSE otherwise
 */
export function isVRSupported(vrToCheck: string): boolean {
    return SUPPORTED_VR.filter((supportedVR) => {
        return supportedVR === vrToCheck;
    }).length > 0;
}

export function isTagValueValid(tagValue: string, tagVR: string): boolean {
    // TODO
    return true;
}

/**
 * @description Checks of given entry is valid
 * @param {DicomEntry} entry entry to validate
 * @returns {ValidationResult} Validation result is object that represents errors
 * for fields that are being validated. Every validated field contains array of errors,
 * that were found during validation. If no errors were found for given field,
 * array is empty (for that particular field).
 */
export function validateDicomEntry(entry: DicomEntry): ValidationResult {
    let validationResult: ValidationResult = {
        tagValueErrors: [],
        tagVRErrors: []
    };

    // check VR validity
    if (!isVRSupported(entry.tagVR)) {
        validationResult.tagVRErrors.push(ErrorType.INVALID_VR);
    }

    // check if value corresponds to VR
    if (!isTagValueValid) {
        validationResult.tagValueErrors.push(ErrorType.VALUE_NOT_MATCH_VR);
        validationResult.tagVRErrors.push(ErrorType.VALUE_NOT_MATCH_VR);
    }

    return validationResult;
}

export function isValidationWithoutErrors(validationResult: ValidationResult): boolean {
    return validationResult.tagValueErrors.length === 0
        && validationResult.tagVRErrors.length === 0;
}