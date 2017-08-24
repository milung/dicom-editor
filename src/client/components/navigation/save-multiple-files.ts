import { DicomReader } from './../../utils/dicom-reader';
import { DicomEditor } from './../../utils/dicom-editor';

import { ApplicationStateReducer } from '../../application-state';
import { HeavyweightFile } from '../../model/file-interfaces';
import { isFileSavedInDb, convertHeavyToLight, saveFileIntoSavedDb } from '../../utils/file-store-util';
import { RecentFileStoreUtil } from '../../utils/recent-file-store-util';
import { storeFilesToDB } from '../../utils/loaded-files-store-util';

export class MultiSave {
    private oneConflict: Function;
    private moreConflicts: Function;

    public constructor(private reducer: ApplicationStateReducer, oneConflict: Function, moreConflicts: Function) {
        this.oneConflict = oneConflict;
        this.moreConflicts = moreConflicts;
    }

    /**
     * @description Saves file into DB, app state and recent files
     * @param {HeavyweightFile} file file to save
     */
    public saveFile(file: HeavyweightFile) {
        let lightFile = convertHeavyToLight(file);
        let dbKey = saveFileIntoSavedDb(file);
        lightFile.dbKey = dbKey;
        let recentFileUtil: RecentFileStoreUtil = new RecentFileStoreUtil(this.reducer);
        recentFileUtil.handleStoringRecentFile(lightFile);
        this.reducer.addSavedFile(lightFile);
    }
    public handleSaveClick(disabled: boolean) {
        if (!disabled) {
            let toBeSaved = this.reducer.getSelectedFiles();
            if (toBeSaved.length === 0) {
                let file: HeavyweightFile | undefined = this.reducer.getState().currentFile;
                if (file) {
                    toBeSaved.push(file);
                }
            }
            this.tryToSaveFiles(toBeSaved);
        }

    }

    private async tryToSaveFiles(toBeSaved: HeavyweightFile[]) {
        let inConflict: HeavyweightFile[] = [];
        for (var i = 0; i < toBeSaved.length; i++) {

            // apply changes to file buffer
            let dicomEditor: DicomEditor = new DicomEditor();
            let updatedBuffer = dicomEditor.applyAllChanges(toBeSaved[i]);

            let dicomReader = new DicomReader();
            let loadedReducer = this.reducer.findLoadedFileByName(toBeSaved[i].fileName);

            // create copy of loaded file with parsed dicom entries from updated buffer
            if (loadedReducer) {
                let loadedCopy: HeavyweightFile = {
                    bufferedData: updatedBuffer,
                    dicomData: dicomReader.getDicomEntries(updatedBuffer), // get newly parsed dicom data
                    fileSize: loadedReducer.fileSize,
                    fileName: loadedReducer.fileName,
                    timestamp: loadedReducer.timestamp,
                    unsavedChanges: undefined
                };
                // remove loaded file so it can be updated
                this.reducer.removeLoadedFiles([loadedReducer]);

                // update loaded file's copy that has updated buffer
                this.reducer.addLoadedFiles([loadedCopy]);
                storeFilesToDB(this.reducer);

                // save updated file
                let success = await this.tryToSaveOneFile(loadedCopy);
                if (!success) {
                    inConflict.push(loadedCopy);
                }
            }

        }
        if (inConflict.length === 1) {
            this.oneConflict(inConflict);
        } else if (inConflict.length > 1) {
            this.moreConflicts(inConflict);
        }
    }

    private async tryToSaveOneFile(file: HeavyweightFile) {
        file.timestamp = (new Date()).getTime();
        let isSaved = await isFileSavedInDb(file);
        if (!isSaved) {
            this.saveFile(file);
            return true;
        }
        return false;
    }
}