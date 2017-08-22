import { DicomEntry } from './dicom-entry';

export interface EditTags {
    entryToChange: DicomEntry;
    tyeOfChange: ChangeType;
}

export enum ChangeType {
    ADD,
    EDIT,
    REMOVE
}
