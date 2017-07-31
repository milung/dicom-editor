import { FileSearcher } from '../../src/client/utils/file-searcher';
import { ApplicationStateReducer } from '../../src/client/application-state';
import { HeavyweightFile } from '../../src/client/model/file-interfaces';
import { expect } from 'chai';

describe('FileSearcher', () => {
    it('search on empty file', () => {
        let reducer = new ApplicationStateReducer();
        let testFile: HeavyweightFile = {
            fileName: 'test',
            timestamp: 12345,
            fileSize: 100,
            bufferedData: new Uint8Array(0),
            dicomData: { entries: [] }
        }

        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('test');
        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(0);
    });

    it('find exact match on tagGroup', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('0001');
        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });


    it('find exact match on tagElement', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('0002');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find exact match on tagName', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('Test name');
        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find partial match on tagGroup', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('1');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find partial match on tagElement', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('02');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find partial match on tagName', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('est n');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find case insensitive match', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('TEsT nAmE');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('match on both tag element and group returned just once', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('00');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find match in one row in two row table', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        testFile.dicomData.entries.push(
            {
                tagGroup: '0011',
                tagElement: '0022',
                tagName: 'Test name2',
                tagValue: 'Test value2',
                tagVR: 'TVR2',
                tagVM: 'TVM2',
                colour: 'test color2',
            }
        );
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('11');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('no search on tag value', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('Test value');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(0);
    });

    it('no search on tagVR and tagVM', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('TV');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(0);
    });

});

function prepareTestDataWithOneRow(): HeavyweightFile {
    let testFile: HeavyweightFile = {
        fileName: 'test',
        timestamp: 12345,
        fileSize: 100,
        bufferedData: new Uint8Array(0),
        dicomData: {
            entries: [
                {
                    tagGroup: '0001',
                    tagElement: '0002',
                    tagName: 'Test name',
                    tagValue: 'Test value',
                    tagVR: 'TVR',
                    tagVM: 'TVM',
                    colour: 'test color',
                }
            ]
        }
    }

    return testFile;
}