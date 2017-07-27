import * as localForage from 'localforage';
import { LightweightFile, HeavyweightFile } from '../model/file-interfaces';
import { ApplicationStateReducer } from '../application-state';
import { DicomReader } from './dicom-reader';
import DbService from './db-service';

import { take, takeRight, includes } from 'lodash';

const MAX_RECENT_FILES = 5;
const SIZE_DELIMITER = '_';

export interface DatabaseEntry {
    fileInterface: LightweightFile;
    data: Uint8Array;
}

export class FileStorage {
    private dicomReader: DicomReader;
    private dbService: DbService;

    /**
     * Constructor of fileStorage which create instace of localForage for storing data to IndexedDB.
     * @param reducer is reducer of application.
     */
    public constructor(private reducer: ApplicationStateReducer) {
        this.dbService = new DbService({
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
     * @param {HeavyweightFile[]} file is interface of file to be stored in recent files. 
     */
    public async storeData(files: HeavyweightFile[]) {
        const lastFiles = takeRight(files, MAX_RECENT_FILES);

        const entries = lastFiles.map(lastFile => {
            return this.prepareDatabaseEntry(lastFile);
        });

        return this.storeDataToDatabase(entries);
    }

    /**
     * Stores database entry into database. If database is full then oldest file is removed from database.
     * If database already contains entry with asociated key then entry in database is updated.
     * @param entryToStore is object which will be stored in indexedDB.
     * @param reducerRecentFiles is array of application recentFiles. 
     * @returns index (in recent files array) of file which was modified.
     */
    public async storeDataToDatabase(entriesToStore: DatabaseEntry[]): Promise<void> {
        const reducerRecentFiles = this.reducer.getState().recentFiles;
        const currentKeys = reducerRecentFiles.map(file => file.dbKey);

        const sameLoadedFiles = entriesToStore.filter(entry => {
            return includes(currentKeys, entry.fileInterface.dbKey);
        });
        const sameKeys = sameLoadedFiles.map(file => file.fileInterface.dbKey);

        const uniqueLoadedFiles = entriesToStore.filter(entry => {
            return !includes(currentKeys, entry.fileInterface.dbKey);
        });
        const uniqueSameKeys = uniqueLoadedFiles.map(file => file.fileInterface.dbKey);

        const uniqueFiles = reducerRecentFiles.filter(file => {
            return !includes(sameKeys, file.dbKey);
        });

        const splitArray = this.getLastFiles(
            uniqueFiles, 
            MAX_RECENT_FILES - uniqueSameKeys.length - sameKeys.length, 
            true
        );

        const mostRecent = splitArray.left;
        const toDelete = splitArray.right;

        const recentFiles = sameLoadedFiles.map(file => {
            return this.prepareLightweightFile(file);
        }).concat(uniqueLoadedFiles.map(file => {
            return this.prepareLightweightFile(file);
        })).concat(mostRecent);

        await this.dbService.removeItems(toDelete.map(entry => entry.dbKey));

        const databaseEntries = sameLoadedFiles.concat(uniqueLoadedFiles).map(file => {
            return {
                key: file.fileInterface.dbKey,
                entry: file
            };
        });

        await this.dbService.setItems<DatabaseEntry>(databaseEntries);

        this.reducer.updateRecentFiles(recentFiles);
    }

    public getLastFiles(
        files: LightweightFile[],
        count: number,
        asc: boolean = false,
        fromStart: boolean = true
    ): { left: LightweightFile[], right: LightweightFile[] } {
        const sorted = files.sort((eA, eB) => eB.timestamp - eA.timestamp);
        const length = sorted.length;

        if (fromStart) {
            return {
                left: take(sorted, count),
                right: takeRight(sorted, length - count)
            };
        } else {
            return {
                left: take(sorted, length - count),
                right: takeRight(sorted, count)
            };
        }
    }

    /**
     * @description Provides access to indexedDB and load file according to dbKey in fileObject.
     * @param {LightweightFile} fileObject represent interface for file to be loaded from indexedDB.
     * @returns {Promise<HeavyWeightFile>} which contains loaded file data from indexedDB.[]
     */
    public async getData(fileObject: LightweightFile): Promise<HeavyweightFile> {

        const entry = await this.dbService.getItem<DatabaseEntry>(fileObject.dbKey);

        return {
            fileName: entry.fileInterface.fileName,
            fileSize: this.getFileSizeFromDbKey(entry.fileInterface.dbKey),
            bufferedData: entry.data,
            timestamp: entry.fileInterface.timestamp,
            dicomData: this.dicomReader.getDicomEntries(entry.data)
        };
    }

    /**
     * @description Load all files stored in indexedDB DICOMviewer in table recentFilesStore.
     */
    public async loadRecentFiles(): Promise<void> {
        const entries: DatabaseEntry[] = await this.dbService.getAll<DatabaseEntry>();

        let recentFiles: LightweightFile[] = entries.map(entry => {
            return {
                fileName: entry.fileInterface.fileName,
                dbKey: entry.fileInterface.dbKey,
                timestamp: entry.fileInterface.timestamp
            };
        });

        recentFiles = recentFiles.sort((elementA, elementB) => elementB.timestamp - elementA.timestamp);

        this.reducer.updateRecentFiles(recentFiles);
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
     * @description creates LightweightFile entry from {DatabaseEntry} object
     * @param {DatabaseEntry} file heavy file to convert
     * @returns {LightweightFile}
     */
    public prepareLightweightFile(entry: DatabaseEntry): LightweightFile {
        return entry.fileInterface;
    }
}
