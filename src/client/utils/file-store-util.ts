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
        return (entryFromDb === undefined);
    });
}

export function convertHeavyToLight(heavyFile: HeavyweightFile): LightweightFile {
    return {
        dbKey: heavyFile.fileName,
        timestamp: heavyFile.timestamp,
        fileName: heavyFile.fileName
    };
}

/**
 * @description Loads files from DB into app state
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
 */
export function saveFileIntoSavedDb(heavyFile: HeavyweightFile) {
    dbService.setItem(heavyFile.fileName, heavyFile);
}

export function deleteFileFromSaved(lightFile: LightweightFile){
    dbService.removeItem(lightFile.dbKey);
}