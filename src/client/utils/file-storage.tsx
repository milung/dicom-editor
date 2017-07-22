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

    /**
     * Constructor of fileStorage which create instace of localForage for storing data to IndexedDB.
     * @param reducer is reducer of application.
     */
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

    /**
     * Store new file into recent file database and update application state of recent files.
     * If database already contains file with asociated key then data in database is updated.  
     * @param {HeavyweightFile} file is interface of file to be stored in recent files. 
     */
    public async storeData(file: HeavyweightFile) {
        let reducerRecentFiles = this.reducer.getState().recentFiles;

        let entryToStore = this.prepareDatabaseEntry(file);
        let indexToModify = this.storeDataToDatabase(entryToStore, reducerRecentFiles);
        await this.updateRecentFiles(indexToModify, entryToStore.fileInterface, reducerRecentFiles);
    }

    /**
     * Stores database entry into database. If database is full then oldest file is removed from database.
     * If database already contains entry with asociated key then entry in database is updated.
     * @param entryToStore is object which will be stored in indexedDB.
     * @param reducerRecentFiles is array of application recentFiles. 
     * @returns index (in recent files array) of file which was modified.
     */
    public storeDataToDatabase(entryToStore: DatabaseEntry, reducerRecentFiles: LightweightFile[]): number {
        let indexToChange = this.findIndexOfFileToUpdate(entryToStore.fileInterface.dbKey, reducerRecentFiles);

        if (reducerRecentFiles.length === MAX_RECENT_FILES && indexToChange === -1) {
            indexToChange = this.findOldestFileIndex(reducerRecentFiles);
            this.storage.removeItem(reducerRecentFiles[indexToChange].dbKey);
        }

        this.storage.setItem(entryToStore.fileInterface.dbKey, entryToStore);
        return indexToChange;
    }

    /**
     * Updates recent files in application state reducer.
     * @param {number} index defines index of element in array of recentFiles to be removed.
     * @param {LightweighFile} fileInterfaceToStore is file interface to be stored in application state.
     * @param {LightweighFile[]} reducerRecentFiles is array of application recentFiles.
     */
    public updateRecentFiles(index: number, fileInterfaceToStore: LightweightFile, 
                             reducerRecentFiles: LightweightFile[]) {
        let newRecentFiles: LightweightFile[] = JSON.parse(JSON.stringify(reducerRecentFiles));

        if (!(reducerRecentFiles.length < MAX_RECENT_FILES && index === -1)) {
            newRecentFiles.splice(index, 1);
        }
        newRecentFiles.unshift(fileInterfaceToStore);

        this.reducer.updateRecentFiles(newRecentFiles);
    }

    /**
     * @description Provides access to indexedDB and load file according to dbKey in fileObject.
     * @param {LightweightFile} fileObject represent interface for file to be loaded from indexedDB.
     * @returns {Promise<HeavyWeightFile>} which contains loaded file data from indexedDB.[]
     */
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

    /**
     * @description Load all files stored in indexedDB DICOMviewer in table recentFilesStore.
     */
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
}
