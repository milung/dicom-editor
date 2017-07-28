import { HeavyweightFile } from './../model/file-interfaces';
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
export function isFileSavedInDb(heavyFile: HeavyweightFile): boolean {
    return false;
}

/**
 * @description Saves file into DB in saved files. If file is already in DB,
 * it is overriden
 * @param {HeavyweightFile} heavyFile file to save into DB
 */
export function saveFileIntoSavedDb(heavyFile: HeavyweightFile) {

}