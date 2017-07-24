import { FileStorage } from './utils/file-storage';
import { HeavyweightFile, LightweightFile } from './model/file-interfaces';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface SelectedFile {
    fileIndex: number;
    colourIndex: number;
}

export interface ApplicationState {
    recentFiles: LightweightFile[];
    loadedFiles: HeavyweightFile[];
    currentFile?: HeavyweightFile;
    currentIndex?: number;
    selectedFiles: SelectedFile[];
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
            selectedFiles: []
        };

        this.stateSubject$ = new BehaviorSubject(this.currentState);
    }

    public addLoadedFiles(files: HeavyweightFile[]) {
        this.currentState.loadedFiles = files.concat(this.currentState.loadedFiles);
        this.currentState.currentFile = files[0];
        this.currentState.currentIndex = this.currentState.loadedFiles.indexOf(files[0]);
        this.stateSubject$.next(this.currentState);
    }

    public getState(): ApplicationState {
        return this.currentState;
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
        let fileStorage = new FileStorage(this);
        fileStorage.getData(file).then(data => {
                this.addLoadedFiles([data]);
            });
    }
}