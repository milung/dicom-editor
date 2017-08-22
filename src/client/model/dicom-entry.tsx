export interface DicomEntry {
    offset: number;
    byteLength: number;
    tagGroup: string;
    tagElement: string;
    tagName: string;
    tagValue: string;
    tagVR: string;
    tagVM: string;
    colour: string;
    sequence: DicomEntry[];
}

/**
 * @description Data used in extended hierarchical table, grouped by module names
 */
export interface DicomExtendedData {
    [moduleName: string]: DicomEntry[];
}

/**
 * @description Simple form of Dicom data, consists only of array of {DicomEntry}
 * @export
 * @interface DicomSimpleData
 */
export interface DicomSimpleData {
    entries: DicomEntry[];
}

/**
 * @description contains all entries that belong to the same tag group
 */
export interface DicomComparisonData {
    group: DicomEntry[];
    tagGroup: string;
    tagElement: string;
}

/**
 * @description Simple form of Dicom comparison data, consists only of array of {DicomComparisonData}
 */
export interface DicomSimpleComparisonData {
    dicomComparisonData: DicomComparisonData[];
}

/**
 * @description DicomComparisonData grouped by modules, used in hierarchical view
 */
export interface DicomExtendedComparisonData {
    [moduleName: string]: DicomComparisonData[];
}
