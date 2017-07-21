import { HeavyweightFile } from './../../model/file-interfaces';
import { ApplicationStateReducer } from '../../application-state';
import { convertFileToArrayBuffer } from '../../utils/file-converter';
import { DicomReader } from '../../utils/dicom-reader';
import { FileStorage } from '../../utils/file-storage';

interface FileContent {
    buffer: Uint8Array;
    fileName: string;
    fileSize: number;
}

export default class FileService {

    private fileStorage: FileStorage;
    private dicomReader: DicomReader;

    public constructor(private reducer: ApplicationStateReducer) {
        this.fileStorage = new FileStorage(reducer);
        this.dicomReader = new DicomReader();
    }

    public async nieco(promises: Promise<FileContent>[]): Promise<HeavyweightFile[]> {
        let bumps: FileContent[];
        try {
            bumps = await Promise.all(promises);
        } catch (err) {
            throw new Error(`Failed to convert file: ${err.toString()}`);
        }

        let loadedFiles: HeavyweightFile[];
        try {
            loadedFiles = bumps.map(bump => {
                return this.createHeavyFile(bump);
            });
        } catch (err) {
            throw new Error(`Failed to convert file: ${err.toString()}`);
        }
        return loadedFiles;
    }

    public createHeavyFile(bump: FileContent): HeavyweightFile {
        let data = {};
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

    public async loadFiles(files: File[]): Promise<void> {

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
            loadedFiles = await this.nieco(promises);
        } catch (err) {
            // TODO handle error... show to user;
            return;
        }

        await this.saveRecentFiles(loadedFiles);

        this.reducer.addLoadedFiles(loadedFiles);
    }

    public async saveRecentFiles(files: HeavyweightFile[]) {
        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            await this.fileStorage.storeData(item);
        }
    }
}