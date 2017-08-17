import { HeavyweightFile, SelectedFile } from './../model/file-interfaces';
import * as localForage from 'localforage';
import { ApplicationStateReducer } from '../application-state';
import DbService from './db-service';
import { ColorDictionary } from './colour-dictionary';

let dbService = new DbService({
    driver: localForage.INDEXEDDB,
    name: 'DICOM viewer',
    version: 1.0,
    storeName: 'loadedFilesStore',
    description: 'Storage for loaded files'
});

let dbServiceSelectedFiles = new DbService({
    driver: localForage.INDEXEDDB,
    name: 'DICOM viewer',
    version: 1.0,
    storeName: 'selectedFilesStore',
    description: 'Storage for selected files'
});

export interface LightweightSelectedFile {
    fileName: string;
    fileSize: number;
    color: string;
}

export async function storeSelectedFileToDB(file: HeavyweightFile, colour: string) {
    let lightFile: LightweightSelectedFile = {
        fileName: file.fileName,
        fileSize: file.fileSize,
        color: colour
    };
    
    dbServiceSelectedFiles.setItem(lightFile.fileName + lightFile.fileSize, lightFile);
}

export async function deleteSelectedFileFromDB(file: HeavyweightFile) {
    dbServiceSelectedFiles.removeItem(file.fileName + file.fileSize);
}

export async function storeSelectedCompareFilesToDB(file: SelectedFile, file2: SelectedFile) {
    storeSelectedFileToDB(file.selectedFile, file.colour);
    storeSelectedFileToDB(file2.selectedFile, file2.colour);
}

export async function deleteAllSelectedFilesFromDB(reducer: ApplicationStateReducer) {
    let keys = [''];
    reducer.getState().selectedFiles.forEach(file => {
        keys.push(file.selectedFile.fileName + file.selectedFile.fileSize);
    });
    dbService.removeItems(keys);
}

export async function loadSelectedFiles(reducer: ApplicationStateReducer, colorDictonary: ColorDictionary) {
   let lightSelectedFiles: LightweightSelectedFile[] = await dbServiceSelectedFiles.getAll<LightweightSelectedFile>();
   // console.log(colorDictonary);
   lightSelectedFiles.forEach(lightFile => {
      reducer.addSelectedFile(lightFile.fileName, lightFile.color);
      if (lightFile.color !== '#000000') {
        colorDictonary.setColorAsUsed(lightFile.color);
      }
   });
  // console.log(colorDictonary);
}

export async function storeComparisonActive(comparisonActive: boolean) {
    dbServiceSelectedFiles.setItem('compareModeActive', comparisonActive);
}

export async function loadComparisonActive(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        resolve(dbServiceSelectedFiles.getItem('compareModeActive'));
    });
}

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
export async function loadLoadedFiles (reducer: ApplicationStateReducer) {
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

export function deleteAllLoadedFilesFromDB(reducer: ApplicationStateReducer) {
    let keys = ['currentFileStorageKey'];
    reducer.getState().loadedFiles.forEach(file => {
        keys.push(file.fileName + file.fileSize);
    });
    dbService.removeItems(keys);
}
