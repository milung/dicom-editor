import { DicomSimpleData } from './dicom-entry';

export interface FileInterface {
    fileName: string;
    timestamp: number;
}

export interface LightweightFile extends FileInterface {
    dbKey: string;
}

export interface HeavyweightFile extends FileInterface {
    fileSize: number;
    bufferedData: Uint8Array;
    dicomData: DicomSimpleData;
}