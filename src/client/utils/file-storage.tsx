import * as localForage from 'localforage';
import { LightweightFile, HeavyweightFile } from '../model/file-interfaces';
import { ApplicationStateReducer } from '../application-state';
import { DicomReader } from './dicom-reader';

const MAX_RECENT_FILES = 5;
const SIZE_DELIMITER = '_';

export interface DatabaseEntry {
    fileInterface: LightweightFile;
    data: Uint8Array;
}

export class FileStorage {
    private storage: LocalForage;
    private dicomReader: DicomReader;

    public constructor(private reducer: ApplicationStateReducer) {
        this.storage = localForage.createInstance({
            driver: localForage.INDEXEDDB,
            name: 'DICOM viewer',
            version: 1.0,
            storeName: 'recentFilesStore',
            description: 'Storage for last 5 dicom files'
        });

        this.dicomReader = new DicomReader();
    }

    public async storeData(file: HeavyweightFile) {
        let entryToStore = this.prepareDatabaseEntry(file);
        let reducerRecentFiles = this.reducer.getState().recentFiles;
        let newRecentFiles: LightweightFile[] = JSON.parse(JSON.stringify(reducerRecentFiles));
        let indexOfFileToUpdate = this.findIndexOfFileToUpdate(entryToStore.fileInterface.dbKey, newRecentFiles);

        if (reducerRecentFiles.length < MAX_RECENT_FILES) {
            if (indexOfFileToUpdate === -1) {
                await this.storage.setItem(entryToStore.fileInterface.dbKey, entryToStore);
                newRecentFiles.unshift(entryToStore.fileInterface);
            } else {
                await this.updateDbAndState(indexOfFileToUpdate, entryToStore, newRecentFiles);
            }
        } else {
            let indexToRemove = this.findOldestFileIndex(reducerRecentFiles);

            if (indexOfFileToUpdate === -1) {
                await this.storage.removeItem(newRecentFiles[indexToRemove].dbKey);
            } else {
                indexToRemove = indexOfFileToUpdate;
            }

            await this.updateDbAndState(indexToRemove, entryToStore, newRecentFiles);
        }

        this.reducer.updateRecentFiles(newRecentFiles);
    }

    public getData(fileObject: LightweightFile): Promise<HeavyweightFile> {

        let fileSize = this.getFileSizeFromDbKey(fileObject.fileName);
        var promise = this.storage.getItem<DatabaseEntry>(fileObject.dbKey).then(function (readValue: DatabaseEntry) {
            let dicomReader = new DicomReader();
            let toReturn: HeavyweightFile = {
                fileName: fileObject.fileName,
                fileSize: fileSize,
                bufferedData: readValue.data,
                timestamp: fileObject.timestamp,
                dicomData: dicomReader.getDicomEntries(readValue.data)
            };

            return toReturn;
        });

        return promise;
    }

    public loadRecentFiles() {
        this.storage.keys().then(keys => {
            let promises = keys.map(key => {
                return this.storage.getItem<DatabaseEntry>(key).then(entry => {
                    let fileInterface: LightweightFile = {
                        fileName: entry.fileInterface.fileName,
                        dbKey: entry.fileInterface.dbKey,
                        timestamp: entry.fileInterface.timestamp
                    };

                    return fileInterface;
                });
            });

            Promise.all(promises).then(recentFiles => {
                recentFiles.sort((elementA, elementB) => elementB.timestamp - elementA.timestamp);
                this.reducer.updateRecentFiles(recentFiles);
            });
        });
    }

    /**
     * @description Parses dbKey containing information about file size and returns size in bytes
     * @param {string} dbKey dbKey to parse
     * @returns {number} size in bytes
     */
    public getFileSizeFromDbKey(dbKey: string): number {
        var lastIndex = dbKey.lastIndexOf(SIZE_DELIMITER);
        var size = dbKey.substr(lastIndex + 1, dbKey.length);
        return parseInt(size, 10);
    }

    /**
     * @description function finds index of file to be updated. Id recentFiles does not contain
     * dbKey to find, -1 is returned
     * @param {string} searchDbKey db key to find in recentFiles
     * @param {LightweightFile[]} recentFiles array of {LightweightFile} objects to find db key in
     * @returns {number} index of found db key or -1 if index is not found
     */
    public findIndexOfFileToUpdate(searchDbKey: string, recentFiles: LightweightFile[]): number {
        for (var i = 0; i < recentFiles.length; i++) {
            if (recentFiles[i].dbKey === searchDbKey) {
                return i;
            }
        }

        return -1;
    }

    /**
     * @description finds oldest file index to be removed from recent files
     * @param {LightweightFile[]} recentFiles recent files to find in
     * @returns {number} index of oldest file
     */
    public findOldestFileIndex(recentFiles: LightweightFile[]): number {
        let indexOfOldestFile = 0;
        let oldestFile = recentFiles[0];

        recentFiles.forEach((file, index) => {
            if (oldestFile.timestamp > file.timestamp) {
                oldestFile = file;
                indexOfOldestFile = index;
            }
        });

        return indexOfOldestFile;
    }

    /**
     * @description creates DB entry from {HeavyweightFile} object
     * @param {HeavyweightFile} file heavy file to convert
     * @returns {DatabaseEntry} DB entry that can be stored into DB
     */
    public prepareDatabaseEntry(file: HeavyweightFile): DatabaseEntry {
        return {
            fileInterface: {
                fileName: file.fileName,
                dbKey: file.fileName + SIZE_DELIMITER + file.fileSize,
                timestamp: file.timestamp,
            },
            data: file.bufferedData
        };
    }

    /**
     * @description inserts entryToStore into new recent files array at specific index
     * @param {number} index index where entry is to be stored into array
     * @param {DatabaseEntry} entryToStore entry to store to DB and memory
     * @param {LightweightFile[]} newRecentFiles new array where entry is to be inserted
     */
    private async updateDbAndState(index: number, entryToStore: DatabaseEntry, newRecentFiles: LightweightFile[]) {
        await this.storage.setItem(entryToStore.fileInterface.dbKey, entryToStore);
        newRecentFiles.splice(index, 1);
        newRecentFiles.unshift(entryToStore.fileInterface);
    }

}
