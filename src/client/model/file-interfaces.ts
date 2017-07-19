export interface LightweightFile {
    fileName: string;
    dbKey: string;
    timestamp: number;
}

export interface HeavyweightFile {
    fileName: string;
    bufferedData: Uint8Array;
    timestamp: number;
}