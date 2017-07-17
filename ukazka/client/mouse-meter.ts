import { Stroke } from './stroke';
import * as lodash from 'lodash';
import { ApplicationStateReducer } from './application-state';
export class MouseMeter {

    public constructor(element: HTMLElement, reducer: ApplicationStateReducer) {
        reducer.state$.subscribe(_ => {
            element.innerText = this.calculateMetric(_.currentStrokes).toString();
        });
    }

    public calculateMetric(strokes: Stroke[]): number {
        return lodash.sum(strokes.map(stroke => this.reduceStroke(stroke)));
    }

    private reduceStroke(stroke: Stroke): number {
        let distance = lodash.reduce(
            stroke.points,
            (acc, point) => {
                if (acc.sum !== null) {
                    return {
                        sum: acc.sum + Math.sqrt(
                            (point.x - acc.x) * (point.x - acc.x) +
                            (point.y - acc.y) * (point.y - acc.y)),
                        x: point.x,
                        y: point.y
                    };
                }
                else return { sum: 0, x: point.x, y: point.y };
            },
            { sum: null, x: 0, y: 0 });
        return distance.sum;
    }
}