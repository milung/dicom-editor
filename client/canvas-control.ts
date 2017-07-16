import * as lodash from "lodash";
import { ApplicationState, ApplicationStateReducer } from './application-state';
import { Stroke } from './stroke';


export class CanvasControl {

    private isDrawing: boolean = false;
    
    public constructor ( elementId: string, private reducer: ApplicationStateReducer) {
        let canvas = document.getElementById(elementId) as HTMLCanvasElement;

        canvas.addEventListener("mousedown", event => this.onMouseDown(event));
        canvas.addEventListener("mouseup", event => this.onMouseUp(event));
        canvas.addEventListener("mousemove", event => this.onMouseMove(event));
    }

    private onMouseDown(event: MouseEvent) {
		this.isDrawing = true;
        this.reducer.addStroke( { x: event.offsetX, y: event.offsetY});
	}

    private onMouseMove(event: MouseEvent) {
        if( this.isDrawing) {
            this.reducer.addStrokePoint( { x: event.offsetX, y: event.offsetY});
        }
    }

    private onMouseUp(event: MouseEvent) {
        if( this.isDrawing) {
            this.reducer.addStrokePoint( { x: event.offsetX, y: event.offsetY});
        }
        this.isDrawing = false;
    }
}