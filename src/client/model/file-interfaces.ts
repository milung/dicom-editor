import { DicomData } from './dicom-entry';

export interface LightweightFile {
    fileName: string;
    dbKey: string;
    timestamp: number;
}

export interface HeavyweightFile {
    fileName: string;
    fileSize: number;
    bufferedData: Uint8Array;
    dicomData: DicomData;
    timestamp: number;
}