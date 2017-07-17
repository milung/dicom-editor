import { ApplicationState, ApplicationStateReducer } from './application-state';


export class ColorControl {   

    public constructor(element: HTMLElement, reducer: ApplicationStateReducer ) {
        let color = element.getAttribute("paint-color");
        element.addEventListener("click", ()=> reducer.setColor(color));
    }

   
}