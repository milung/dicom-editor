import { expect } from 'chai';
import { ColorDictionary } from '../../src/client/utils/colour-dictionary';

describe('color-dictionary', () => {
    it('should get first color - red', ()=>{
        let dict = new ColorDictionary();
        expect(dict.getColorByIndex(0)).to.equal('#00BB00');
    });

    it('should get first color (as free) in color dictionary', () => {
        let dict = new ColorDictionary();
        let result = dict.getFirstFreeColor();
        expect(result).to.equal(dict.getColorByIndex(0));
    });

    // zbytocne, kym vieme porovavat len dva subory
    // it('should get third color (as free) in color dictionary', () => {
    //     let dict = new ColorDictionary();
    //     dict.getFirstFreeColor();
    //     dict.getFirstFreeColor();
    //     let result = dict.getFirstFreeColor();
    //     expect(result).to.equal(dict.getColorByIndex(2));
    // });

    it('should get black color (all colors are in use)', () => {
        let dict = new ColorDictionary();
        let i: number;
        for (i=0; i<7; i++){
            dict.getFirstFreeColor();
        }
        let result = dict.getFirstFreeColor();
        expect(result).to.equals('black');
    });

    it ('should free the first color and then get it again', () => {
        let dict = new ColorDictionary();
        let firstColor = dict.getFirstFreeColor();
        dict.freeColor(firstColor);
        let checkFirstColor = dict.getFirstFreeColor();
        expect(checkFirstColor).to.equal(firstColor);
    });

    it('should reset the dictionary and get the first color', () => {
        let dict = new ColorDictionary();
        dict.getFirstFreeColor();
        dict.reset();
        expect(dict.getFirstFreeColor()).to.equal(dict.getColorByIndex(0));
    });

});