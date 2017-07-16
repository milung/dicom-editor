
import { Painter } from "./painter";
import { ApplicationState, ApplicationStateReducer } from './application-state';
import * as lodash from 'lodash';
import { ColorControl } from './color-control';
import { CanvasControl } from './canvas-control';
import { ClearControl } from './clear-control';
import { DbService } from './db-service';
import { DbConnect } from './db-connect';
import { DrawingSelectControl } from './drawing-select-control';
import { MouseMeter } from './mouse-meter';

let reducer = new ApplicationStateReducer();

let controls: ColorControl[] = lodash.map(
        document.getElementsByClassName('paint-color'), 
        element=>  new ColorControl(element as HTMLElement, reducer));
let canvasControl = new CanvasControl("myCanvas", reducer);
let clearControl = new ClearControl("paint-clear", reducer);
let selectControl = new DrawingSelectControl("drawing-select",reducer);
let meters = new MouseMeter( 
        document.getElementById("meters"),
        reducer);

let painter = new Painter("myCanvas", reducer);
painter.startRenderingLoop();

let dbService = new DbService();
let dbConnect = new DbConnect(dbService, reducer);