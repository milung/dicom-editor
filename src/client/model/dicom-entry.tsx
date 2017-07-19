export interface DicomEntry {
    tagGroup: string;
    tagElement: string;
    tagName: string;
    tagValue: string;
}

export interface DicomGroupEntry {
    groupNumber: string;
    groupName: string;
    entries: DicomEntry[];
}

export interface DicomData {
    [groupNumber: string]: DicomGroupEntry;
}