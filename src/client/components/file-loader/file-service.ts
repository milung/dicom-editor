import { ApplicationStateReducer } from '../../application-state';
import { HeavyweightFile } from '../../model/file-interfaces';
import { convertFileToArrayBuffer } from '../../utils/file-converter';

export default class FileService {
    public constructor(private reducer: ApplicationStateReducer) {

    }

    public async loadFiles(files: File[]) {
        const promises = files.map(file => {
            return convertFileToArrayBuffer(file)
                .then(buffer => {
                    return {
                        buffer: buffer,
                        file: file
                    };
                });
        });

        const results = await Promise.all(promises);

        const loadedFiles: HeavyweightFile[] = results.map(item => {
            return {
                fileName: item.file.name,
                bufferedData: item.buffer,
                timestamp: new Date().getTime()
            };
        });

        this.reducer.addLoadedFiles(loadedFiles);
    }
}