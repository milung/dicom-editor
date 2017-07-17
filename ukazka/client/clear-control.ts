import { ApplicationStateReducer } from './application-state';
export class ClearControl {

    public constructor(elementId: string, reducer: ApplicationStateReducer) {
        let element =document.getElementById(elementId);
        element.addEventListener("click", ()=> reducer.clearCanvas());
    }
}