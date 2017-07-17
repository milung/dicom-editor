import "mocha";
import { expect } from "chai";
import { Stroke } from './stroke';
import * as lodash from 'lodash';
import { ApplicationStateReducer } from './application-state';
import { MouseMeter } from './mouse-meter';

describe("MouseMeter", () => {
    it("return 0 for empty drawing", () => {
        // given
        let subject = new MouseMeter({} as HTMLElement, new ApplicationStateReducer());

        // when 
        let result = subject.calculateMetric([]);

        // then
        expect(result).to.be.equal(0);

    });

    it("return 10 for single stroke of length 10", () => {
        // given
        let subject = new MouseMeter({} as HTMLElement, new ApplicationStateReducer());
        let stroke = new Stroke({ x: 10, y: 10 }, "black");
        stroke.points.push({ x: 20, y: 10 });

        // when 
        let result = subject.calculateMetric([stroke]);

        // then
        expect(result).to.be.equal(10);
    });

    it("return 50 for single diagonal stroke of length 50", () => {
        // given
        let subject = new MouseMeter({} as HTMLElement, new ApplicationStateReducer());
        let stroke = new Stroke({ x: 10, y: 10 }, "black");
        stroke.points.push({ x: 40, y: 50 });

        // when 
        let result = subject.calculateMetric([stroke]);

        // then
        expect(result).to.be.equal(50);
    });

    it("return 60 for singlemultipoint stroke of length 60", () => {
        // given
        let subject = new MouseMeter({} as HTMLElement, new ApplicationStateReducer());
        let stroke = new Stroke({ x: 10, y: 10 }, "black");
        stroke.points.push({ x: 40, y: 50 });
        stroke.points.push({ x: 50, y: 50 });

        // when 
        let result = subject.calculateMetric([stroke]);

        // then
        expect(result).to.be.equal(60);
    });

    it("return 80 for multiple strokes of length 80", () => {
        // given
        let subject = new MouseMeter({} as HTMLElement, new ApplicationStateReducer());
        let stroke1 = new Stroke({ x: 10, y: 10 }, "black");
        stroke1.points.push({ x: 40, y: 50 });
        stroke1.points.push({ x: 50, y: 50 });

        let stroke2 = new Stroke({ x: 10, y: 10 }, "black");
        stroke2.points.push({ x: 30, y: 10 });

        // when 
        let result = subject.calculateMetric([stroke1, stroke2]);

        // then
        expect(result).to.be.equal(80);
    });

    it("updates element text", done => {
        // given
        let reducer = new ApplicationStateReducer();
        let element = { innerText: "" } as HTMLElement;
        let stroke = new Stroke({ x: 10, y: 10 }, "black");
        stroke.points.push({ x: 20, y: 10 });

        let subject = new MouseMeter(element, reducer);

        reducer.state$.subscribe(_ => {
            if (_.currentStrokes.length > 0) {
                // then
                expect(element.innerText).to.be.equal("10");
                done();
            }
        });

        // when
        reducer.setStrokes([stroke]);

        
    });
});