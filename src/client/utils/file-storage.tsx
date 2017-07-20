import * as localForage from 'localforage';
import { LightweightFile, HeavyweightFile } from '../model/file-interfaces';
import { ApplicationStateReducer } from '../application-state';
import { DicomReader } from './dicom-reader';

const MAX_RECENT_FILES_IN_DB = 5;

interface DatabaseEntry {
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
            storeName: 'dataStore',
            description: 'Storage for last 5 dicom files'
        });

        this.dicomReader = new DicomReader();
    }

    public async storeData(dataArray: Uint8Array, fileObject: File) {
        let entryToStore = this.prepareDatabaseEntry(dataArray, fileObject);
        let reducerRecentFiles = this.reducer.getState().recentFiles;
        let newRecentFiles: LightweightFile[] = JSON.parse(JSON.stringify(reducerRecentFiles));

        let count = await this.storage.length();
        let indexOfUpdateFile = this.findIndexOfUpdatedFile(entryToStore.fileInterface.dbKey, newRecentFiles);
        
        if (count < MAX_RECENT_FILES_IN_DB && reducerRecentFiles.length < MAX_RECENT_FILES_IN_DB) {
            await this.storage.setItem(entryToStore.fileInterface.dbKey, entryToStore);
            if (indexOfUpdateFile === -1) { 
                newRecentFiles.unshift(entryToStore.fileInterface);
            } else {
                newRecentFiles.splice(indexOfUpdateFile, 1);
                newRecentFiles.unshift(entryToStore.fileInterface);
            }
        } else {
            let indexOfOldest = this.findOldestFileIndex(reducerRecentFiles);

            let keys = await this.storage.keys();
            if (keys.indexOf(entryToStore.fileInterface.dbKey) !== -1) {
                await this.storage.setItem(entryToStore.fileInterface.dbKey, entryToStore);
                newRecentFiles.splice(indexOfUpdateFile, 1);
                newRecentFiles.unshift(entryToStore.fileInterface);
            } else {
                let oldestFile: LightweightFile = newRecentFiles[indexOfOldest];
                if (oldestFile) {
                    await this.storage.removeItem(oldestFile.dbKey);
                    await this.storage.setItem(entryToStore.fileInterface.dbKey, entryToStore);

                    newRecentFiles.splice(indexOfOldest, 1);
                    newRecentFiles.unshift(entryToStore.fileInterface);
                }
            }
        }

        this.reducer.updateRecentFiles(newRecentFiles);
    }

    public getData(fileObject: LightweightFile): Promise<HeavyweightFile> {

        var promise = this.storage.getItem<DatabaseEntry>(fileObject.dbKey).then(function (readValue: DatabaseEntry) {
            let dicomReader = new DicomReader();
            let toReturn: HeavyweightFile = {
                fileName: fileObject.fileName,
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

     private findOldestFileIndex(recentFiles: LightweightFile[]): number {
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

    private prepareDatabaseEntry(dataArray: Uint8Array, fileObject: File): DatabaseEntry {
        let newDbEntry: DatabaseEntry = {
            fileInterface: {
                fileName: fileObject.name,
                dbKey: fileObject.name + '_' + fileObject.size,
                timestamp: new Date().getTime(),
            },
            data: dataArray
        };

        return newDbEntry;
    }

    private findIndexOfUpdatedFile(searchDbKey: string, recentFiles: LightweightFile[]): number {
        for (var i = 0; i < recentFiles.length; i++) {
            if (recentFiles[i].dbKey === searchDbKey) {
                return i;
            }
        }

        return -1;
    }
}
