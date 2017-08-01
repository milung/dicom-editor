import { RecentFileStoreUtil } from './utils/recent-file-store-util';
import { HeavyweightFile, LightweightFile } from './model/file-interfaces';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface SelectedFile {
    selectedFile: HeavyweightFile;
    colour: string;
}

export interface ApplicationState {
    recentFiles: LightweightFile[];
    loadedFiles: HeavyweightFile[];
    currentFile?: HeavyweightFile;
    currentIndex?: number;
    selectedFiles: SelectedFile[];
    comparisonActive: boolean;
    savedFiles: LightweightFile[];
    searchExpression: string;
}

export class ApplicationStateReducer {
    private currentState: ApplicationState;
    private stateSubject$: BehaviorSubject<ApplicationState>;

    public get state$(): Observable<ApplicationState> {
        return this.stateSubject$;
    }

    public constructor() {
        this.currentState = {
            recentFiles: [],
            loadedFiles: [],
            currentFile: undefined,
            currentIndex: undefined,
            selectedFiles: [],
            comparisonActive: false,
            savedFiles: [],
            searchExpression: ''
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

    public addLoadedFiles(files: HeavyweightFile[]) {
        files.forEach(element => {
            this.addOneLoadedFile(element);
        });
        this.currentState.currentFile = files[0];
        this.currentState.currentIndex = this.currentState.loadedFiles.indexOf(files[0]);
        this.stateSubject$.next(this.currentState);
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
        this.stateSubject$.next(this.currentState);
    }

    public updateCurrentFromRecentFile(file: LightweightFile) {
        let fileStorage = new RecentFileStoreUtil(this);
        fileStorage.getRecentFile(file.dbKey).then(data => {
            this.addLoadedFiles([data]);
        });
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
        let freeColor = this.currentState.selectedFiles[indexToRemove].colour;

        this.currentState.selectedFiles.splice(indexToRemove, 1);
        this.stateSubject$.next(this.currentState);

        return freeColor;
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

    private findLoadedFileByName(fileName: string): (HeavyweightFile | undefined) {
        for (var index = 0; index < this.currentState.loadedFiles.length; index++) {
            if (this.currentState.loadedFiles[index].fileName === fileName) {
                return this.currentState.loadedFiles[index];
            }
        }

        return undefined;
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
        this.currentState.loadedFiles.forEach((e, index) => {
            if (e.fileName === file.fileName) {
                this.currentState.loadedFiles.splice(index, 1);
            }
        });
        this.currentState.loadedFiles.unshift(file);
    }
}