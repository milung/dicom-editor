import { DicomSimpleData } from './../../model/dicom-entry';
import { HeavyweightFile } from './../../model/file-interfaces';
import { ApplicationStateReducer } from '../../application-state';
import { convertFileToArrayBuffer } from '../../utils/file-converter';
import { DicomReader } from '../../utils/dicom-reader';
import { FileStorage } from '../../utils/file-storage';

export interface FileContent {
    buffer: Uint8Array;
    fileName: string;
    fileSize: number;
}

export class FileService {

    private fileStorage: FileStorage;
    private dicomReader: DicomReader;

    public constructor(private reducer: ApplicationStateReducer) {
        this.fileStorage = new FileStorage(reducer);
        this.dicomReader = new DicomReader();
    }

    /**
     * @description Constructs HeavyFiles from base File objects
     * @param {Promise<FileContent>[]} promises 
     * @returns {Promise<HeavyweightFile[]>} 
     */
    
    public async processLoadedFiles(promises: Promise<FileContent>[]): Promise<HeavyweightFile[]> {
        let bumps: FileContent[];
        try {
            bumps = await Promise.all(promises);
        } catch (err) {
            throw new Error(`Failed to convert file: ${err.toString()}`);
        }

        let loadedFiles: HeavyweightFile[] = bumps.map(bump => {
            return this.createHeavyFile(bump);
        });

        return loadedFiles;
    }

    /**
     * @description Parse file with dicomReader
     * @param {FileContent} bump 
     * @returns {HeavyweightFile} 
     */
    public createHeavyFile(bump: FileContent): HeavyweightFile {
        let data: DicomSimpleData = {
            entries: []
        };
        try {
            data = this.dicomReader.getDicomEntries(bump.buffer);
        } catch (err) {
            throw new Error(`Could not parse file ${bump.fileName}, message: ${err.toString()}`);
        }

        return {
            fileName: bump.fileName,
            fileSize: bump.fileSize,
            bufferedData: bump.buffer,
            dicomData: data,
            timestamp: new Date().getTime()
        };
    }

    /**
     * @description Parse and save loaded files to state
     * @param {File[]} files 
     * @returns {Promise<void>} 
     */
    public async loadFiles(files: File[]): Promise<void> {
        /**
         * replace DOM File object with custom FileContent structure
         */
        const promises: Promise<FileContent>[] = files.map(file => {
            return convertFileToArrayBuffer(file)
                .then(buffer => {
                    return {
                        buffer: buffer,
                        fileName: file.name,
                        fileSize: file.size
                    };
                });
        });

        let loadedFiles: HeavyweightFile[];
        try {
            loadedFiles = await this.processLoadedFiles(promises);
        } catch (err) {
            // TODO handle error... show to user;
            return;
        }

        await this.saveRecentFiles(loadedFiles);

        this.reducer.addLoadedFiles(loadedFiles);
    }

    /**
     * @description Save loaded files as recent files
     * @param {HeavyweightFile[]} files 
     * @returns {Promise<void>} 
     */
    public async saveRecentFiles(files: HeavyweightFile[]): Promise<void> {
        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            await this.fileStorage.storeData(item);
        }
    }
}