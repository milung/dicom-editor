import { expect } from 'chai';
import { DicomEntry } from "../../src/client/model/dicom-entry";
import { isTagValueValid } from "../../src/client/utils/dicom-validator";
import { vrTooltipDictionary } from '../../src/client/utils/vr-tooltips-dictionary';
const tagIncorrectValues: DicomEntry[] = [
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: 'ORIGINAL\PRIMARY\AXIAL\HELIXaa',
        tagVR: 'CS',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '20061012a',
        tagVR: 'DA',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '091719.0000001',
        tagVR: 'TM',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '1.2.840.10008.5.1.4.1.1.2..',
        tagVR: 'UI',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '1.0ff',
        tagVR: 'DS',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '400wdaf',
        tagVR: 'IS',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '512bn',
        tagVR: 'US',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: 'dicomlibrary-1001',
        tagVR: 'SH',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    }
]
const tagCorrectValues: DicomEntry[] = [
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: 'ORIGINAL\\PRIMARY\\AXIAL\\HELIX',
        tagVR: 'CS',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '20061012',
        tagVR: 'DA',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '091719.000000',
        tagVR: 'TM',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '1.2.840.10008.5.1.4.1.1.2',
        tagVR: 'UI',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '1.0',
        tagVR: 'DS',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '400',
        tagVR: 'IS',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: '512',
        tagVR: 'US',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    },
    {
        id: 1,
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: 'dicomlibrary-100',
        tagVR: 'SH',
        tagVM: '4',
        colour: '#000000',
        sequence: []
    }
]
const correctTooltipVR = [
    'Code String',
    'Date',
    'Time',
    'Unique Identifier(UID)',
    'Decimal String',
    'Integer String',
    'Unsigned Short',
    'Short String'
]

describe('dicom-validator -> ', () => {
    it('Incorrect values are marked as incorrect', () => {
        let counter = 0;
        for (var i = 0; i < tagIncorrectValues.length; i++) {
            if (!isTagValueValid(tagIncorrectValues[i])) {
                counter++;
            }
        }
        expect(counter).to.equal(8);
    });

    it('Correct values are marked as correct', () => {
        let counter = 0;
        for (var i = 0; i < tagCorrectValues.length; i++) {
            if (isTagValueValid(tagCorrectValues[i])) {
                counter++;
            }
        }
        expect(counter).to.equal(8);
    });

    it('Validation tooltip dictionary returns correct tooltips', () => {
        let counter = 0;

        for (var i = 0; i < tagCorrectValues.length; i++) {
            if (vrTooltipDictionary[tagCorrectValues[i].tagVR][0] === correctTooltipVR[i]) {
                counter++;
            }
        }
        expect(counter).to.equal(8);
    });

});