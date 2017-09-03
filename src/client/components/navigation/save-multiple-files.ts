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
    private currentFile: HeavyweightFile | undefined;

    public constructor(private reducer: ApplicationStateReducer, oneConflict: Function, moreConflicts: Function) {
        this.oneConflict = oneConflict;
        this.moreConflicts = moreConflicts;
        this.currentFile = reducer.getState().currentFile;
    }

    /**
     * @description Saves file into DB, app state and recent files
     * @param {HeavyweightFile} file file to save
     */
    public saveFile(file: HeavyweightFile) {

        // apply changes to file buffer
        let dicomEditor: DicomEditor = new DicomEditor();
        let updatedBuffer = dicomEditor.applyAllChanges(file);

        let dicomReader = new DicomReader();
        let loadedFromReducer = this.reducer.findLoadedFileByName(file.fileName);

        // create copy of loaded file with parsed dicom entries from updated buffer
        if (loadedFromReducer) {
            let loadedCopy: HeavyweightFile = {
                bufferedData: updatedBuffer,
                dicomData: dicomReader.getDicomEntries(updatedBuffer), // get newly parsed dicom data
                fileSize: loadedFromReducer.fileSize,
                fileName: loadedFromReducer.fileName,
                timestamp: loadedFromReducer.timestamp,
                unsavedChanges: undefined
            };
            // remove unsaved changes from file
            loadedFromReducer.unsavedChanges = [];

            // remove loaded file so it can be updated
            this.reducer.removeLoadedFiles([loadedFromReducer], false);

            // update loaded file's copy that has updated buffer
            this.reducer.addLoadedFiles([loadedCopy], false);
            // this causes the former current file to remain opened
            if (this.currentFile !== undefined && loadedCopy.fileName === this.currentFile.fileName) {
                this.reducer.updateCurrentFile(loadedCopy);
            }
            storeFilesToDB(this.reducer);

            let lightFile = convertHeavyToLight(loadedCopy);
            let dbKey = saveFileIntoSavedDb(loadedCopy);
            lightFile.dbKey = dbKey;
            let recentFileUtil: RecentFileStoreUtil = new RecentFileStoreUtil(this.reducer);
            recentFileUtil.handleStoringRecentFile(lightFile);
            this.reducer.addSavedFile(lightFile);
        }

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

            // save updated file
            let success = await this.tryToSaveOneFile(toBeSaved[i]);
            if (!success) {
                inConflict.push(toBeSaved[i]);
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