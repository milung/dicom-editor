import { DicomReader } from './../../src/client/utils/dicom-reader';
import { DicomSimpleData } from './../../src/client/model/dicom-entry';
import { expect } from 'chai';

describe('DicomReader getSopClassFromParsedDicom()', () => {
    it('should get sop class correctly from parsed dicom', () => {

        let parsedDicom: DicomSimpleData = {
            entries: [
                {
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0008',
                    tagElement: '0016',
                    tagName: 'SOP class',
                    tagValue: 'my ultra sop class',
                    tagVR: 'PN',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                },
                {
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0010',
                    tagElement: '1548',
                    tagName: 'PatientAge',
                    tagValue: '18',
                    tagVR: 'PA',
                    tagVM: '1',
                    colour: '#000000',
                    sequence: []
                },
                {
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0152',
                    tagElement: '0145',
                    tagName: 'PatientName',
                    tagValue: 'Michal Mrkvicka',
                    tagVR: 'PN',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                },
                {
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0010',
                    tagElement: '1548',
                    tagName: 'PatientAge',
                    tagValue: '18',
                    tagVR: 'PA',
                    tagVM: '1',
                    colour: '#000000',
                    sequence: []
                }
            ]
        };

        let reader: DicomReader = new DicomReader();

        let sop = reader.getSopClassFromParsedDicom(parsedDicom);
        expect(sop).to.equal('my ultra sop class');
    });

    it('should return undefined SOP class for empty array', () => {
        let parsedDicom: DicomSimpleData = {
            entries: [
            ]
        };

        let reader: DicomReader = new DicomReader();

        let sop = reader.getSopClassFromParsedDicom(parsedDicom);
        expect(sop).to.equal(undefined);
    });
});