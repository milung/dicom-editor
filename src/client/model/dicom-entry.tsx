export interface DicomEntry {
    tagGroup: string;
    tagElement: string;
    tagName: string;
    tagValue: string;
    tagVR: string;
    tagVM: string;
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

export interface DicomComparisonEntry {
    entry: DicomEntry;
    colour: string;
}