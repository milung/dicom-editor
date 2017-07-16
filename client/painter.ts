import * as lodash from "lodash";
import { ApplicationState, ApplicationStateReducer } from './application-state';
import { Stroke } from './stroke';

import 'rxjs/add/operator/map';

export class Painter {

    private canvas: HTMLCanvasElement;
    private isInvalid: boolean = true;
    private isRendering: boolean  = false;
    private latestStrokes: Stroke[]= [];
    
    
    public constructor ( elementId: string, private reducer: ApplicationStateReducer) {
        this.canvas = document.getElementById(elementId) as HTMLCanvasElement;
        
        this.reducer.state$.map(state=>state.currentStrokes).subscribe(
            strokes => {
                this.isInvalid = true;
                this.latestStrokes = strokes;
            }
        )

    }

    public startRenderingLoop() {
        this.isRendering = true;
        let context = this.canvas.getContext("2d");
        this.renderingLoop(context);
    }

    public stopRenderingLoop() {
        this.isRendering = false;
    }

    private renderingLoop(context: CanvasRenderingContext2D){
        if(this.isRendering) {
            this.paint(context, this.latestStrokes);
            requestAnimationFrame(()=>this.renderingLoop(context));
        }
    }

    private paint( context: CanvasRenderingContext2D, strokes: Stroke[]) {
        if( this.isInvalid) {
            context.fillStyle = "lightgray";
            context.fillRect( 0,0, this.canvas.width, this.canvas.height);

            
            strokes.forEach( stroke => {
                context.strokeStyle = stroke.color;
                let coord = lodash.head(stroke.points);
                context.beginPath();
                context.moveTo(coord.x,coord.y);
                lodash.tail(stroke.points)
                    .forEach( point => context.lineTo(point.x, point.y));
                context.stroke();
            });

            this.isInvalid = false;
        }
    }
}