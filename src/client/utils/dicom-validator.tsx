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
    'DT',
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
    'UN',
    'TM'
];

const defaultCharacterRepertoire = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    ':',
    ';',
    '<',
    '=',
    '>',
    '?',
    '!',
    '"',
    '#',
    '$',
    '%',
    '&',
    '\'',
    '(',
    ')',
    '*',
    '+',
    ',',
    '-',
    '.',
    '/',
    '@',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '[',
    '\\',
    ']',
    '^',
    '_',
    '`',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '{',
    '|',
    '}',
    '~',
    ' ',
    '\n',
    '\r',
    '\f'
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

export function isTagValueValid(entry: DicomEntry): boolean {
    let tagValue = entry.tagValue;
    let tagVR = entry.tagVR;
    if (tagValue === undefined) {
        return true;
    }
    switch (tagVR) {
        case 'AE': {
            if (tagValue.length > 16) { // multivalue?
                return false;
            }
            if (tagValue.match(/(\n|\r|\f)/)) {
                return false;
            }
            if (!checkForDefaultRepertoire(tagValue)) {
                return false;
            }
            return true;
        }
        case 'AS': {
            const regex = /^[0-9]{3}(Y|M|W|D)$/;
            if (!isValid(tagValue, 4, regex)) {
                return false;
            }

            return true;
        }
        case 'AT': {
            const tagRegex = /^[a-zA-Z0-9]{4}(,|\s|)[a-zA-Z0-9]{4}$/;
            if (!isValid(tagValue, 9, tagRegex)) {
                return false;
            }

            if (tagValue.indexOf(',') >= 0) {
                entry.tagValue = tagValue.replace(',', '');
            } else if (tagValue.indexOf(' ') >= 0) {
                entry.tagValue = tagValue.replace(' ', '');
            }
            return true;
        }
        case 'CS': {
            const regex = /^[A-Z0-9_\s]*$/;

            if (!isValid(tagValue, 16, regex)) {
                return false;
            }

            return true;
        }
        case 'DA': {
            const regex = /^((19|20)[0-9]{2})\.?(0[1-9]|1[0-2])\.?(0[1-9]|[12][0-9]|3[01])$/;

            if (!isValid(tagValue, 11, regex)) {
                return false;
            }

            return true;
        }
        case 'DS': {
            const regex = /^[0-9\+-eE\.]*$/;
            if (!isValid(tagValue, 16, regex)) {
                return false;
            }
            return true;
        }
        case 'DT': {
            // YYYYMMDDHHMMSS.FFFFFF&ZZXX
            // &ZZXX part is optional
            // & can be +- ZZ = hours XX = minutes of offset
            const regex = new RegExp([
                '^((19|20)[0-9]{2})',
                '(0[1-9]|1[0-2])((0[1-9]|[12][0-9]|3[01])([01][0-9]|2[0-3])',
                '([0-5][0-9])([0-5][0-9]|60))?',
                '((\\.[0-9]{1,6})?((-(0[0-9]|1[0-2])([0-5][0-9]))|(\\+(0[0-9]|1[0-4])([0-5][0-9])))?)?$'
            ].join(''));

            if (!isValid(tagValue, 26, regex)) {
                return false;
            }
            return true;
        }
        case 'FL': {
            const regex = /^(-)?[0-9]+(.[0-9]+)?$/;
            if (!isValid(tagValue.toString(), 32, regex)) {
                return false;
            }
            return true;
        }
        case 'FD': {
            const regex = /^(-)?[0-9]+(.[0-9]+)?$/;
            if (!isValid(tagValue.toString(), 64, regex)) {
                return false;
            }
            return true;
        }
        case 'IS': {
            const maxValue = 2147483648;
            const regex = /^(\t|\s)*?(\+|-)?[0-9]+(\t|\s)*?$/;
            let numberOfSpaces = tagValue.split(' ').length - 1;
            if (!isValid(tagValue, 12 + numberOfSpaces, regex)) {
                return false;
            }
            if (tagValue.indexOf('-') >= 0) {
                tagValue = tagValue.substring(1);
            }
            if (parseInt(tagValue, 10) > maxValue - 1 || parseInt(tagValue, 10) < maxValue * -1) {
                return false;
            }
            return true;
        }
        case 'LO': {
            if (tagValue.length > 64) {
                return false;
            }
            if (tagValue.match(/(\n|\r|\f)/)) {
                return false;
            }
            if (!checkForDefaultRepertoire(tagValue)) {
                return false;
            }
            return true;
        }
        case 'LT': {
            if (tagValue.length > 10240 || !checkForDefaultRepertoire(tagValue)) {
                return false;
            }
            return true;
        }
        case 'ST': {
            if (tagValue.length > 1024 || !checkForDefaultRepertoire(tagValue)) {
                return false;
            }
            return true;
        }
        case 'OD': {
            return true;
        }
        case 'OF': {
            return true;
        }
        case 'PN': {
            const regex = /^.*$/;
            if (tagValue.split('\^').length > 5) {
                return false;
            }
            if (tagValue.match(/(\n|\r|\f)/)) {
                return false;
            }
            if (!isValid(tagValue, 64, regex)) {
                return false;
            }
            return true;
        }
        case 'SH': {
            const regex = /^.*$/;
            if (tagValue.match(/(\n|\r|\f)/)) {
                return false;
            }
            if (!checkForDefaultRepertoire(tagValue)) {
                return false;
            }
            if (!isValid(tagValue, 16, regex)) {
                return false;
            }
            return true;
        }
        case 'SL': {
            const maxValue = 2147483648;
            const regex = /^(-)?[0-9]+$/;
            if (parseInt(tagValue, 10) > maxValue - 1 || parseInt(tagValue, 10) < maxValue * -1) {
                return false;
            }
            if (!isValid(tagValue.toString(), 12, regex)) {
                return false;
            }
            return true;
        }
        case 'SS': {
            const maxValue = 32768;
            const regex = /^(-)?[0-9]+$/;
            if (parseInt(tagValue, 10) > maxValue - 1 || parseInt(tagValue, 10) < maxValue * -1) {
                return false;
            }
            if (!isValid(tagValue.toString(), 6, regex)) {
                return false;
            }
            return true;
        }
        case 'TM': {
            // HHMMSS.FFFFFF
            // .FFFFF, SS, MM are optional but require the left part to be present
            // e.g. HHMM is valid but HHSS is invalid
            const regex = new RegExp([
                '^((([01][0-9]|2[0-3]):?([0-5][0-9])?)||(([01][0-9]|2[0-3]):?([0-5][0-9]):?',
                '([0-5][0-9]|60))||(([01][0-9]|2[0-3]):?([0-5][0-9]):?([0-5][0-9]|60)(.[0-9]{1,6})))$'
            ].join(''));
            if (!isValid(tagValue, 26, regex)) {
                return false;
            }
            return true;
        }
        case 'UI': {
            const regex = /^([0-9]+(\.[0-9]+)*?)+$/;
            if (!isValid(tagValue, 64, regex)) {
                return false;
            }
            return true;
        }
        case 'UL': {
            const maxValue = 4294967296;
            const regex = /^[0-9]*$/;
            if (parseInt(tagValue, 10) < 0 || parseInt(tagValue, 10) > maxValue) {
                return false;
            }
            if (!isValid(tagValue.toString(), 11, regex)) {
                return false;
            }
            return true;
        }
        case 'US': {
            const maxValue = 65536;
            const regex = /^[0-9]*$/;
            if (parseInt(tagValue, 10) < 0 || parseInt(tagValue, 10) > maxValue) {
                return false;
            }
            if (!isValid(tagValue.toString(), 6, regex)) {
                return false;
            }
            return true;
        }
        default: {
            return true;
        }
    }
}

/**
 * 
 * @param tagValue value to be validated
 * @param maxValueLength max length of value, needed for > 1 VM
 * @param regex rules for tagValue to be checked against
 * @description checks if tagValue has > 1 VM and for each value length is checked as well as validity with regex
 */
function isValid(tagValue: string, maxValueLength: number, regex: RegExp): boolean {
    if (tagValue === undefined) {
        return false;
    }
    let multiplicity = tagValue.split('\\') === undefined ? 1 : tagValue.split('\\').length;
    // console.log(multiplicity);
    // console.log(tagValue + ' ' + tagValue.split('\\'));

    for (var i = 0; i < multiplicity; i++) {
        let oneTagValue = tagValue.split('\\')[i];
        if (oneTagValue.length > maxValueLength || !regex.test(oneTagValue)) {
            return false;
        }
    }
    return true;
}
/**
 * 
 * @param tagValue string to be checked
 * @description checks whether tagValue contains only allowed characters from DICOM Default Character Repertoire
 */
function checkForDefaultRepertoire(tagValue: string): boolean {
    for (var character of tagValue) {
        if (defaultCharacterRepertoire.indexOf(character) === -1) {
            return false;
        }
    }
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
    if (!isTagValueValid(entry)) {
        validationResult.tagValueErrors.push(ErrorType.VALUE_NOT_MATCH_VR);
        validationResult.tagVRErrors.push(ErrorType.VALUE_NOT_MATCH_VR);
    }

    return validationResult;
}

export function isValidationWithoutErrors(validationResult: ValidationResult): boolean {
    return validationResult.tagValueErrors.length === 0
        && validationResult.tagVRErrors.length === 0;
}