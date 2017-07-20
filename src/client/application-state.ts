import { HeavyweightFile, LightweightFile } from './model/file-interfaces';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface ApplicationState {
    recentFiles: LightweightFile[];
    loadedFiles: HeavyweightFile[];
    currentFile?: HeavyweightFile;
    currentIndex?: number;
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
            currentIndex: undefined
        };

        this.stateSubject$ = new BehaviorSubject(this.currentState);
    }

    public getState(): ApplicationState {
        return this.currentState;
    }

    public addLoadedFiles(files: HeavyweightFile[]) {
        this.currentState.loadedFiles = this.currentState.loadedFiles.concat(files);
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
}