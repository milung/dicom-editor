import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DicomEntry } from './model/dicom-entry';

export interface ApplicationState {
    dicomEntries: DicomEntry[];
}

export class ApplicationStateReducer {
    private currentState: ApplicationState;
    private stateSubject$: BehaviorSubject<ApplicationState>;

    public get state$(): Observable<ApplicationState> {
        return this.stateSubject$;
    }

    public constructor() {
        this.currentState = {
            dicomEntries: [],
        }

        this.stateSubject$ = new BehaviorSubject(this.currentState);
    }

}