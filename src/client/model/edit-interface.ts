import { DicomEntry } from './dicom-entry';

export interface EditTags {
    entry: DicomEntry;
    type: ChangeType;
}

export enum ChangeType {
    ADD,
    EDIT,
    REMOVE
}
