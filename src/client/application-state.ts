import { DicomData } from './model/dicom-entry';
import { HeavyweightFile, LightweightFile } from './model/file-interfaces';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface ApplicationState {
    dicomData: DicomData;
    recentFiles: LightweightFile[],
    loadedFiles: HeavyweightFile[],
    currentFile?: HeavyweightFile,
    currentIndex?: number
}

export class ApplicationStateReducer {
    private currentState: ApplicationState;
    private stateSubject$: BehaviorSubject<ApplicationState>;

    public get state$(): Observable<ApplicationState> {
        return this.stateSubject$;
    }

    public constructor() {
        this.currentState = {
            dicomData: {},
            recentFiles: [],
            loadedFiles: [],
            currentFile: undefined,
            currentIndex: undefined
        };

        this.stateSubject$ = new BehaviorSubject(this.currentState);
    }

    public addLoadedFiles(files: HeavyweightFile[]) {
        this.currentState.loadedFiles = this.currentState.loadedFiles.concat(files);

        console.log(files, this.currentState);
        this.stateSubject$.next(this.currentState);
    }
}