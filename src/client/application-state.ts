import { PalleteItem } from './components/pallete-button-menu/pallete-button-menu';
import { HeavyweightFile, LightweightFile, SelectedFile } from './model/file-interfaces';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { deleteFileFromLoaded, switchCurrentLoadedFile, updateSelectedFile } from './utils/loaded-files-store-util';
import { DicomEntry } from './model/dicom-entry';

export interface ApplicationState {
    recentFiles: LightweightFile[];
    loadedFiles: HeavyweightFile[];
    currentFile?: HeavyweightFile;
    currentIndex?: number;
    selectedFiles: SelectedFile[];
    comparisonActive: boolean;
    savedFiles: LightweightFile[];
    searchExpression: string;
    palleteMenuAction?: PalleteItem;
    curentExportFileNumber: number;
    entryBeingEdited?: DicomEntry;
}

export class ApplicationStateReducer {
    private currentState: ApplicationState;
    private stateSubject$: BehaviorSubject<ApplicationState>;

    public get state$(): Observable<ApplicationState> {
        return this.stateSubject$;
    }

    public constructor() {
        this.currentState = {
            curentExportFileNumber: 0,
            recentFiles: [],
            loadedFiles: [],
            currentFile: undefined,
            currentIndex: undefined,
            selectedFiles: [],
            comparisonActive: false,
            savedFiles: [],
            searchExpression: '',
        };

        this.stateSubject$ = new BehaviorSubject(this.currentState);
    }

    public addSavedFile(lightFile: LightweightFile) {
        let isPresent = false;
        let index: number = 0;

        this.currentState.savedFiles.forEach((item, i) => {
            if (item.fileName === lightFile.fileName) {
                isPresent = true;
                index = i;
            }
        });

        if (isPresent) {
            this.currentState.savedFiles[index] = lightFile;
        } else {
            this.currentState.savedFiles.push(lightFile);
        }

        this.stateSubject$.next(this.currentState);
    }

    public updateSavedFiles(files: LightweightFile[]) {
        this.currentState.savedFiles = files;
        this.stateSubject$.next(this.currentState);
    }
    /**
     * 
     * @param files files to be loaded
     * @param setAsCurrent value represents whether to set loaded file as current. Same as in 
     * removeLoadedFiles function.
     */
    public addLoadedFiles(files: HeavyweightFile[], setAsCurrent?: boolean) {
        if (setAsCurrent === undefined) {
            setAsCurrent = true;
        }
        files.forEach(element => {
            this.addOneLoadedFile(element);
        });
        if (setAsCurrent) {
            this.currentState.currentFile = files[0];
            this.currentState.currentIndex = this.currentState.loadedFiles.indexOf(files[0]);
        }

        this.stateSubject$.next(this.currentState);
    }
    /**
     * 
     * @param files files to be removed
     * @param setNextCurrent value represents whether to set next non current file as current. This value
     * is neccessary during saving files action due to rapid switching effect it can cause.
     * @description removes files from loaded tab
     */
    public removeLoadedFiles(files: HeavyweightFile[], setNextCurrent?: boolean) {
        if (setNextCurrent === undefined) {
            setNextCurrent = true;
        }
        files.forEach(file => {
            let index = this.currentState.loadedFiles.indexOf(file);
            deleteFileFromLoaded(file, this);
            if (index >= 0) {
                this.currentState.loadedFiles.splice(index, 1);
                this.removeSelectedFile(file.fileName);
            }

            // if there are some files behind deleted index, load first one of them
            // only in case that removing current file
            // variable index points to next item now
            if (this.currentState.currentFile === file && setNextCurrent) {
                if (index <= this.currentState.loadedFiles.length - 1) {
                    this.updateCurrentFile(this.currentState.loadedFiles[index]);
                } else {
                    this.updateCurrentFile(this.currentState.loadedFiles[0]);
                }
                if (this.currentState.loadedFiles.length > 0) {
                    switchCurrentLoadedFile(this.currentState.currentFile);
                }
            }
            this.stateSubject$.next(this.currentState);
        });
    }

    public getState(): ApplicationState {
        return this.currentState;
    }

    /**
     * @description removes file from recent files in application state
     * @param {number} index index of file to remove
     */
    public removeRecentFile(index: number) {
        this.currentState.recentFiles.splice(index, 1);
        this.stateSubject$.next(this.currentState);
    }

    public updateRecentFiles(files: LightweightFile[]) {
        this.currentState.recentFiles = files;
        this.stateSubject$.next(this.currentState);
    }

    public updateCurrentFile(file: HeavyweightFile) {
        this.currentState.currentFile = file;
        if (this.currentState.currentFile) {
            this.currentState.currentFile.unsavedChanges = file.unsavedChanges;
        }
        this.stateSubject$.next(this.currentState);
    }

    public addSelectedFile(fileName: string, newColour: string) {
        let file = this.findLoadedFileByName(fileName);
        if (file) {
            this.currentState.selectedFiles.push({
                selectedFile: file,
                colour: newColour
            });
            this.stateSubject$.next(this.currentState);
        }
    }

    public removeSelectedFile(fileName: string): string {
        let indexToRemove = this.findSelectedFileIndexByName(fileName);

        let freeColor = '';
        if (indexToRemove >= 0) {
            freeColor = this.currentState.selectedFiles[indexToRemove].colour;
            this.currentState.selectedFiles.splice(indexToRemove, 1);
        }
        this.stateSubject$.next(this.currentState);

        return freeColor;
    }

    public changeColors(color: string) {
        for (var file of this.currentState.selectedFiles) {
            if (file.colour === 'black') {
                file.colour = color;
                this.stateSubject$.next(this.currentState);
                updateSelectedFile(file);
                break;
            }
        }
    }

    public getSelectedFiles(): HeavyweightFile[] {
        let selected: HeavyweightFile[] = [];
        this.currentState.selectedFiles.forEach(file => {
            selected.push(file.selectedFile);
        });
        return selected;
    }

    public setComparisonActive(value: boolean) {
        this.currentState.comparisonActive = value;
        this.stateSubject$.next(this.currentState);
    }

    public removeAllSelectedFiles() {
        this.currentState.selectedFiles.length = 0;
    }

    public setSearchExpression(searchExpression: string) {
        this.currentState.searchExpression = searchExpression;
        this.stateSubject$.next(this.currentState);
    }

    public setCurentExportFileNumber(value: number) {
        this.currentState.curentExportFileNumber = value;
        this.stateSubject$.next(this.currentState);
    }

    public findLoadedFileByName(fileName: string): (HeavyweightFile | undefined) {
        for (var index = 0; index < this.currentState.loadedFiles.length; index++) {
            if (this.currentState.loadedFiles[index] && this.currentState.loadedFiles[index].fileName === fileName) {
                return this.currentState.loadedFiles[index];
            }
        }

        return undefined;
    }

    public setEditEntry(entry?: DicomEntry) {
        this.currentState.entryBeingEdited = entry;
        this.stateSubject$.next(this.currentState);
    }

    private findSelectedFileIndexByName(fileName: string): number {
        for (var index = 0; index < this.currentState.selectedFiles.length; index++) {
            if (this.currentState.selectedFiles[index].selectedFile.fileName === fileName) {
                return index;
            }
        }

        return -1;
    }

    private addOneLoadedFile(file: HeavyweightFile) {
        let prev = this.currentState.loadedFiles[0];
        let loadedFiles = this.currentState.loadedFiles;

        if (loadedFiles === undefined || loadedFiles.length <= 0) {
            loadedFiles.push(file);
            return;
        }

        if (file.fileName.localeCompare(loadedFiles[0].fileName) < 0) {
            this.currentState.loadedFiles.unshift(file);
        } else if (file.fileName.localeCompare(loadedFiles[loadedFiles.length - 1].fileName) > 0) {
            this.currentState.loadedFiles.splice(loadedFiles.length, 0, file);
        } else {
            this.currentState.loadedFiles.forEach((e, index) => {
                if (e.fileName === file.fileName) {
                    this.currentState.loadedFiles.splice(index, 1, file);
                    prev = e;
                    return;
                } else if (file.fileName.localeCompare(e.fileName) < 0 &&
                    file.fileName.localeCompare(prev.fileName) > 0) {
                    this.currentState.loadedFiles.splice(index, 0, file);
                    prev = e;
                    return;
                }
            });
        }
    }
}