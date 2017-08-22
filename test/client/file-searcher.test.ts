import { FileSearcher } from '../../src/client/utils/file-searcher';
import { ApplicationStateReducer } from '../../src/client/application-state';
import { HeavyweightFile } from '../../src/client/model/file-interfaces';
import { DicomComparisonData } from '../../src/client/model/dicom-entry';
import { expect } from 'chai';
import { prepareSimpleTestComparisionData, prepareTestFile, prepareTestFileWithSequence } from "./test-utils";

describe('FileSearcher -> searchFile() ->', () => {
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
        let testFile = prepareTestFile();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('0001');
        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });


    it('find exact match on tagElement', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFile();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('0002');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find exact match on tagName', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFile();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('Test name');
        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find partial match on tagGroup', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFile();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('1');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find partial match on tagElement', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFile();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('02');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find partial match on tagName', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFile();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('est n');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find case insensitive match', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFile();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('TEsT nAmE');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('match on both tag element and group returned just once', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFile();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('00');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('find match in one row in two row table', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFile();
        testFile.dicomData.entries.push(
            {
                tagGroup: '0011',
                tagElement: '0022',
                tagName: 'Test name2',
                tagValue: 'Test value2',
                tagVR: 'TVR2',
                tagVM: 'TVM2',
                colour: 'test color2',
                sequence: []
            }
        );
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('11');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
    });

    it('no search on tag value', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFile();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('Test value');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(0);
    });

    it('no search on tagVR and tagVM', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFile();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('TV');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(0);
    });

    it('sequence search returns sequence', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFileWithSequence();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('Sequence name');

        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries.length).to.equal(1);
        expect(fs.searchFile().entries[0].tagName).to.equal('Sequence name');
    });

    it('sequence name search returns whole sequence', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFileWithSequence();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('Sequence name');

        let fs = new FileSearcher(reducer);
        let res = fs.searchFile();
        expect(res.entries[0].sequence.length).to.equal(1);
        expect(res.entries[0].sequence[0].tagName).to.equal('Test name');
    });

    it('sequence children search returns children nested in sequence', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFileWithSequence();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('Test name');

        let fs = new FileSearcher(reducer);
        let res = fs.searchFile();
        expect(res.entries[0].tagName).to.equal('Sequence name');
        expect(res.entries[0].sequence[0].tagName).to.equal('Test name');
    });

    it('search on no file', () => {
        let reducer = new ApplicationStateReducer();
        let fs = new FileSearcher(reducer);
        expect(fs.searchFile().entries).to.deep.equal([]);
    });

    it('sequence is not added if do not contain specific value', () => {
        let reducer = new ApplicationStateReducer();
        let testFile = prepareTestFileWithSequence();
        reducer.updateCurrentFile(testFile);
        reducer.setSearchExpression('Specific Value');

        let fs = new FileSearcher(reducer);
        let res = fs.searchFile();
        expect(res.entries.length).to.equal(0);
    });
});

describe('FileSearcher -> searchCompareData() ->', () => {
    it('search on empty comparision data', () => {
        let reducer = new ApplicationStateReducer();
        let data: DicomComparisonData[] = [];

        let fs = new FileSearcher(reducer);
        expect(fs.searchCompareData(data).dicomComparisonData.length).to.equal(0);
    });

    it('find exact match on tagGroup', () => {
        let reducer = new ApplicationStateReducer();
        let data = prepareSimpleTestComparisionData();
        reducer.setSearchExpression('0001');

        let fs = new FileSearcher(reducer);
        expect(fs.searchCompareData(data).dicomComparisonData.length).to.equal(1);
    });

    it('find exact match on tagElement on both compared rows', () => {
        let reducer = new ApplicationStateReducer();
        let data = prepareSimpleTestComparisionData();
        reducer.setSearchExpression('0002');

        let fs = new FileSearcher(reducer);
        expect(fs.searchCompareData(data).dicomComparisonData[0].group.length).to.equal(2);
    });

    it('find no match', () => {
        let reducer = new ApplicationStateReducer();
        let data = prepareSimpleTestComparisionData();
        reducer.setSearchExpression('xxx');

        let fs = new FileSearcher(reducer);
        expect(fs.searchCompareData(data).dicomComparisonData.length).to.equal(0);
    });

    it('search for tagElement and tagGroup using comma + space', () => {
        let reducer = new ApplicationStateReducer();
        let data = prepareSimpleTestComparisionData();
        reducer.setSearchExpression('0001, 0002');

        let fs = new FileSearcher(reducer);
        expect(fs.searchCompareData(data).dicomComparisonData.length).to.equal(1);
    });

    it('search for tagElement and tagGroup without comma or space', () => {
        let reducer = new ApplicationStateReducer();
        let data = prepareSimpleTestComparisionData();
        reducer.setSearchExpression('00010002');

        let fs = new FileSearcher(reducer);
        expect(fs.searchCompareData(data).dicomComparisonData.length).to.equal(1);
    });

    it('search in tagElement and tagGroup as in one string', () => {
        let reducer = new ApplicationStateReducer();
        let data = prepareSimpleTestComparisionData();
        reducer.setSearchExpression('1000');

        let fs = new FileSearcher(reducer);
        expect(fs.searchCompareData(data).dicomComparisonData.length).to.equal(1);
    });
});