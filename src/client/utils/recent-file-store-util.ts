import { LightweightFile, HeavyweightFile } from './../model/file-interfaces';
import * as localForage from 'localforage';
import { ApplicationStateReducer } from '../application-state';
import { DicomReader } from './dicom-reader';
import DbService from './db-service';
import { getData } from './file-store-util';

const MAX_RECENT_FILES = 5;

export class RecentFileStoreUtil {
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
     * @description Handles storing of recent file into recent files DB.
     * Updates app state if needed and indexedDB. In case that maximum amount 
     * of recent files would be exceeded, last recent file is deleted.
     * @param {LightweightFile} file file to take care of
     */
    public async handleStoringRecentFile(file: LightweightFile) {
        const reducerRecentFiles: LightweightFile[] = this.reducer.getState().recentFiles;
        const currentKeys = reducerRecentFiles.map(reducerFile => reducerFile.dbKey);
        let index = currentKeys.indexOf(file.dbKey);

        // if present, update position of file
        if (index > -1) {
            reducerRecentFiles.splice(index, 1);
        } else if (reducerRecentFiles.length >= MAX_RECENT_FILES) {
            // if maximum limit of files exceeded, remove last recent file
            reducerRecentFiles.pop();
        }

        // store file
        reducerRecentFiles.unshift(file);
        await this.dbService.setItem(file.dbKey, file);
        this.reducer.updateRecentFiles(reducerRecentFiles);
    }

    /**
     * @description Load all files stored in indexedDB DICOMviewer in table recentFilesStore.
     */
    public async loadRecentFiles() {
        let files: LightweightFile[] = await this.dbService.getAll<LightweightFile>();

        files = files.sort((elementA, elementB) => elementB.timestamp - elementA.timestamp);

        this.reducer.updateRecentFiles(files);
    }

    /**
     * @description Finds light file from recent files DB according to given DB key.
     * Then loads heavy file from saved file DB
     * @param {string} dbKey db key to find file for
     * @returns {Promise<HeavyweightFile>} loaded heavy file from saved files DB
     */
    public getRecentFile(dbKey: string): Promise<HeavyweightFile> {
        return this.dbService.getItem<LightweightFile>(dbKey).then((lightFile) => {
            return getData(lightFile);
        });
    }

}
