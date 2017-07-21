import { HeavyweightFile } from './../../model/file-interfaces';
import { ApplicationStateReducer } from '../../application-state';
import { convertFileToArrayBuffer } from '../../utils/file-converter';
import { DicomReader } from '../../utils/dicom-reader';
import { DicomData } from '../../model/dicom-entry';
import { FileStorage } from '../../utils/file-storage';

interface TmpData {
    buffer: Uint8Array;
    file: File;
    dicomData: DicomData;
}

export default class FileService {

    private fileStorage: FileStorage;

    public constructor(private reducer: ApplicationStateReducer) {
        this.fileStorage = new FileStorage(reducer);
    }

    public async loadFiles(files: File[]): Promise<void> {
        let dicomReader = new DicomReader();
        const promises = files.map(file => {
            return convertFileToArrayBuffer(file)
                .then(buffer => {
                    let data = {};
                    try {
                        data = dicomReader.getDicomEntries(buffer);
                    } catch (err) {
                        throw new Error(`Could not load file ${file.name}`);
                    }
                    return {
                        buffer: buffer,
                        file: file,
                        dicomData: data
                    };
                });
        });

        let results: TmpData[] = [];
        try {
            results = await Promise.all(promises);
            for (let i = 0; i < results.length; i++) {
                const item = results[i];
                await this.fileStorage.storeData(this.createHeavyFile(item));
            }
        } catch (err) {
            // console.log(err);
            return;
        }

        const loadedFiles: HeavyweightFile[] = results.map(item => {
            return this.createHeavyFile(item);
        });

        this.reducer.addLoadedFiles(loadedFiles);
    }

    /**
     * Helper method creates HeavyWeightFile object from temp data
     */
    private createHeavyFile(tmpData: TmpData) {
        return {
            fileName: tmpData.file.name,
            fileSize: tmpData.file.size,
            bufferedData: tmpData.buffer,
            dicomData: tmpData.dicomData,
            timestamp: new Date().getTime()
        };
    }
}