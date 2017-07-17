import { ApplicationStateReducer, ApplicationState } from './application-state';
import * as lodash from 'lodash';

export class DrawingSelectControl {

    private selectElement: HTMLSelectElement;    

    public constructor(elementId: string, private reducer: ApplicationStateReducer) {
        this.selectElement = document.getElementById(elementId) as HTMLSelectElement;
        this.selectElement.addEventListener("change", _ => this.onSelectionChanged());

        let newButtonElement = document.getElementById(elementId+"-new") as HTMLButtonElement;
        newButtonElement.addEventListener("click", _ => reducer.createDrawing());

        reducer.state$.subscribe(_=> this.updateDrawingsBox(_));
    }

    private onSelectionChanged() {
        let drawing = this.selectElement.selectedOptions[0].label;
        this.reducer.setCurrentDrawing(drawing);
    } 
    
    private updateDrawingsBox(state: ApplicationState) {
        this.selectElement.options.length = 0;
        state.drawings.forEach( _ => 
            this.selectElement.options.add(new Option(_.name, _.name)));
       

        let selectIndex = lodash.findIndex(
            this.selectElement.options,
            opt => opt.label === state.currentDrawing);        
        this.selectElement.selectedIndex = selectIndex;            
    }

    
}