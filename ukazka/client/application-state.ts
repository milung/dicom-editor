import { Stroke, Coordinates } from './stroke';

import {BehaviorSubject} from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import * as lodash from 'lodash';
import { DrawingEntry } from './drawing-entry';

export interface ApplicationState {
    currentColor: string ;
    currentStrokes: Stroke[];
    currentDrawing: string;
    drawings: DrawingEntry[];

}

export class ApplicationStateReducer {
    
    private currentState: ApplicationState;
    private stateSubject$: BehaviorSubject<ApplicationState>;

    public get state$(): Observable<ApplicationState> { 
        return this.stateSubject$;
    }

    public constructor(){
        this.currentState= { 
            currentColor: "black", 
            currentStrokes: [],
            currentDrawing: null,
            drawings: []
        };
        this.stateSubject$ = new BehaviorSubject(this.currentState);
    }

    public setColor( color: string) {
        this.currentState.currentColor = color;
        this.stateSubject$.next(this.currentState);
    }

    public addStroke( coords: Coordinates) {
        this.currentState.currentStrokes.push(new Stroke(coords, this.currentState.currentColor));
        this.stateSubject$.next(this.currentState);
    }

    public addStrokePoint(coords:Coordinates) {        
        lodash.last(this.currentState.currentStrokes).points.push(coords);
        this.stateSubject$.next(this.currentState);
    }

    public clearCanvas() {
        this.currentState.currentColor = "black";
        this.currentState.currentStrokes.length =  0;
        this.stateSubject$.next(this.currentState);
    }

     public setStrokes(strokes: Stroke[]) {
        this.currentState.currentStrokes = strokes;
        this.stateSubject$.next(this.currentState);
    }

    public resetDrawings(drawings: DrawingEntry[]) {
        this.currentState.drawings = drawings;
        let first = drawings[0];
        this.currentState.currentDrawing = first.name;
        this.currentState.currentStrokes = first.strokes;

        this.stateSubject$.next(this.currentState);
    }

    public createDrawing() {
        let index = this.currentState.drawings.length;
        let entry: DrawingEntry = { name: "Drawing-" + index, strokes: [] };

        this.currentState.drawings.push(entry);
        this.currentState.currentColor = "black";
        this.currentState.currentDrawing = entry.name;
        this.currentState.currentStrokes = entry.strokes;

        this.stateSubject$.next(this.currentState);
    }

    public setCurrentDrawing(name: string) {
        let drawing = this.currentState.drawings.find(_=>_.name === name);
        if(drawing)
        {
            this.currentState.currentDrawing = drawing.name;
            this.currentState.currentStrokes = drawing.strokes;

            this.stateSubject$.next(this.currentState);
        }
    }    

}