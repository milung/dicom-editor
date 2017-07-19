import { DicomData } from './model/dicom-entry';
import { DicomReader } from './utils/dicom-reader';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface ApplicationState {
    dicomData: DicomData;
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
        };

        this.stateSubject$ = new BehaviorSubject(this.currentState);
    }

    public handleInputFile(file: File) {
        let dicomReader = new DicomReader();
        dicomReader.getData(file).then(
            data => {
                this.currentState.dicomData = data;
                this.stateSubject$.next(this.currentState);
            }
        );
    }

}