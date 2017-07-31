import { ApplicationStateReducer } from './../application-state';
import { HeavyweightFile, LightweightFile } from './../model/file-interfaces';
import * as localForage from 'localforage';
import DbService from './db-service';

let dbService = new DbService({
    driver: localForage.INDEXEDDB,
    name: 'DICOM viewer',
    version: 1.0,
    storeName: 'savedFiles',
    description: 'Storage for saved files'
});

/**
 * @description Checks if file is already saved in DB in saved files
 * @param {HeavyweightFile} heavyFile file to check
 * @returns {boolean} TRUE if file is already in DB, FALSE otherwise
 */
export async function isFileSavedInDb(heavyFile: HeavyweightFile): Promise<boolean> {
    return dbService.getItem(heavyFile.fileName).then(entryFromDb => {
        return (!((entryFromDb === undefined) || (entryFromDb === null)));
    });
}

/**
 * @description Function converts instance of HeavyweightFile into LightweightFile
 * @param heavyFile file to be converted into lightFile
 * @returns {LightweightFile} instance of lighFile from heavyFile
 */
export function convertHeavyToLight(heavyFile: HeavyweightFile): LightweightFile {
    return {
        dbKey: heavyFile.fileName,
        timestamp: heavyFile.timestamp,
        fileName: heavyFile.fileName
    };
}

/**
 * @description Loads files from DB into app state
 * @param {ApplicationStateReducer} reducer represents reducer of application.
 */
export function loadSavedFiles(reducer: ApplicationStateReducer) {
    dbService.getAll<LightweightFile>().then(files => {
        files.forEach(element => {
            element.dbKey = element.fileName;
        });
        reducer.updateSavedFiles(files);
    });
}

/**
 * @description Saves file into DB in saved files. If file is already in DB,
 * it is overriden
 * @param {HeavyweightFile} heavyFile file to save into DB
 * @return database key that was used to store file
 */
export function saveFileIntoSavedDb(heavyFile: HeavyweightFile): string {
    let dbKey = heavyFile.fileName; 
    dbService.setItem(dbKey, heavyFile);
    return dbKey;
}

/**
 * @description Removes file from DB in saved files.
 * @param {LightweightFile} lightFile representation of file for removing from DB
 */
export function deleteFileFromSaved(lightFile: LightweightFile) {
    dbService.removeItem(lightFile.dbKey);
}

/**
 * @description Provides access to indexedDB and load file according to dbKey in fileObject.
 * @param {LightweightFile} fileObject represent interface for file to be loaded from indexedDB.
 * @returns {Promise<HeavyWeightFile>} which contains loaded file data from indexedDB.[]
 */
export async function getData(fileObject: LightweightFile): Promise<HeavyweightFile> {
    return await dbService.getItem<HeavyweightFile>(fileObject.dbKey);
}