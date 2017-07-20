import { ApplicationStateReducer } from '../../application-state';
import { HeavyweightFile } from '../../model/file-interfaces';
import { convertFileToArrayBuffer } from '../../utils/file-converter';
import { DicomReader } from '../../utils/dicom-reader';

export default class FileService {
    public constructor(private reducer: ApplicationStateReducer) {

    }

    public async loadFiles(files: File[]) {
        const promises = files.map(file => {
            let dicomReader = new DicomReader();
            return convertFileToArrayBuffer(file)
                .then(buffer => {
                    return dicomReader.getDicomEntries(buffer)
                        .then(data => {
                            return {
                                buffer: buffer,
                                file: file,
                                dicomData: data
                            };
                        });
                });
        });

        const results = await Promise.all(promises);

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