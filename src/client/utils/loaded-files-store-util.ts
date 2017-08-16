import { HeavyweightFile } from './../model/file-interfaces';
import * as localForage from 'localforage';
import { ApplicationStateReducer } from '../application-state';
import DbService from './db-service';

let dbService = new DbService({
    driver: localForage.INDEXEDDB,
    name: 'DICOM viewer',
    version: 1.0,
    storeName: 'loadedFilesStore',
    description: 'Storage loaded files'
});

/**
 * @description Handles storing of loaded file into loaded files DB and app state.
 * Updates app state if needed and indexedDB. In case that maximum amount 
 * of loaded files would be exceeded, last loaded file is deleted.
 * @param {LightweightFile} file file to take care of
 */
export async function storeFilesToDB(reducer: ApplicationStateReducer) {
    const currentFileKey = 'currentFileStorageKey';
    const reducerLoadedFiles: HeavyweightFile[] = reducer.getState().loadedFiles;

    const currentFileToStore = reducer.getState().currentFile;

    const currentKeys = reducerLoadedFiles.map((reducerFile, index) => {
        return reducerFile.fileName + reducerFile.fileSize.toString();
    });

    for (var i = 0; i < currentKeys.length; i++) {
        if (currentFileToStore !== undefined &&
            reducerLoadedFiles[i].fileName === currentFileToStore.fileName) {
            dbService.setItem(currentFileKey, reducerLoadedFiles[i]);
        } else {
            dbService.setItem(currentKeys[i], reducerLoadedFiles[i]);
        }

    }

}

export async function switchCurrentLoadedFile(file: HeavyweightFile) {
    const currentFileKey = 'currentFileStorageKey';

    const lastCurrentFile: HeavyweightFile = await dbService.getItem<HeavyweightFile>(currentFileKey);

    dbService.setItem(currentFileKey, file);
    dbService.removeItem(file.fileName + file.fileSize);
    if (!((lastCurrentFile === undefined) || (lastCurrentFile === null))) {
        dbService.setItem(lastCurrentFile.fileName + lastCurrentFile.fileSize, lastCurrentFile);  
    }
}

/**
 * @description Load all files stored in indexedDB DICOMviewer in table loadedFilesStore.
 */
export async function loadLoadedFiles(reducer: ApplicationStateReducer) {
    let files: HeavyweightFile[] = await dbService.getAll<HeavyweightFile>();
    let currentFile: HeavyweightFile = await dbService.getItem<HeavyweightFile>('currentFileStorageKey');

    reducer.addLoadedFiles(files);
    reducer.updateCurrentFile(currentFile);
}

export function deleteFileFromLoaded(file: HeavyweightFile, reducer: ApplicationStateReducer) {
    const currentFileKey = 'currentFileStorageKey';
    let fileKey = '';
    const currFile = reducer.getState().currentFile;
    if (currFile !== undefined) {
        fileKey = currFile.fileName + currFile.fileSize;
    } else {
        return;
    }

    if (file.fileName + file.fileSize === fileKey) {
        dbService.removeItem(currentFileKey);
    } else {
        dbService.removeItem(file.fileName + file.fileSize);
    }
}
