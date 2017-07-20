import { ApplicationStateReducer } from '../../application-state';
import { HeavyweightFile } from '../../model/file-interfaces';
import { convertFileToArrayBuffer } from '../../utils/file-converter';
import { DicomReader } from "../../utils/dicom-reader";
import { DicomData } from "../../model/dicom-entry";

interface tmpData {
    buffer: Uint8Array,
    file: File,
    dicomData: DicomData
}

export default class FileService {
    public constructor(private reducer: ApplicationStateReducer) {

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

        let results: tmpData[] = [];
        try {
            results = await Promise.all(promises);
        } catch (err) {
            console.log(err);
            return;
        }

        const loadedFiles: HeavyweightFile[] = results.map(item => {

            return {
                fileName: item.file.name,
                bufferedData: item.buffer,
                dicomData: item.dicomData,
                timestamp: new Date().getTime()
            };
        });

        this.reducer.addLoadedFiles(loadedFiles);
    }
}