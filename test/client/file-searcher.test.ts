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
        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('test').length).to.equal(0);
    });

    it('find exact match on tagGroup', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('0001').length).to.equal(1);
    });


    it('find exact match on tagElement', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('0002').length).to.equal(1);
    });

    it('find exact match on tagName', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('Test name').length).to.equal(1);
    });

    it('find partial match on tagGroup', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('1').length).to.equal(1);
    });

    it('find partial match on tagElement', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('02').length).to.equal(1);
    });

    it('find partial match on tagName', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('est n').length).to.equal(1);
    });

    it('find case insensitive match', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('TEsT nAmE').length).to.equal(1);
    });

    it('match on both tag element and group returned just once', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('00').length).to.equal(1);
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

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('11').length).to.equal(1);
    });

    it('no search on tag value', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('Test value').length).to.equal(0);
    });

    it('no search on tagVR and tagVM', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestDataWithOneRow();
        reducer.updateCurrentFile(testFile);

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile('TV').length).to.equal(0);
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