import { DicomSimpleData, DicomExtendedData, DicomEntry } from './../../src/client/model/dicom-entry';
import { expect } from 'chai';
import { convertSimpleDicomToExtended, sortDicomEntries } from '../../src/client/utils/dicom-entry-converter';
import { getModuleNamesForTag } from '../../src/client/utils/module-name-translator';

// convertSimpleDicomToExtended
describe('dicom-entry-converter', () => {
    it('should convert empty simple Dicom data to empty extended', () => {
        let dicomSimple: DicomSimpleData = {
            entries: []
        };
        let expectedDicomExtended: DicomExtendedData = {};
        let resultDicom = convertSimpleDicomToExtended(dicomSimple);
        expect(resultDicom).to.deep.equal(expectedDicomExtended);
    });

    it('should convert simple Dicom data to extended', () => {
        let dicomSimple: DicomSimpleData = {
            entries: [
                {
                    tagGroup: '0008',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000'
                },
                {
                    tagGroup: '0007',
                    tagElement: '0016',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000'
                },
                {
                    tagGroup: '0012',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000'
                }
            ]
        };

        let expectedDicomExtended: DicomExtendedData = {
            'SOP COMMON MODULE ATTRIBUTES': [
                {
                    tagGroup: '0008',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000'
                }
            ],

            'Undefined module group': [
                {
                    tagGroup: '0007',
                    tagElement: '0016',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000'
                },
                {
                    tagGroup: '0012',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000'
                }
            ]
        };
        let resultDicom = convertSimpleDicomToExtended(dicomSimple);
        expect(resultDicom).to.deep.equal(expectedDicomExtended);
    });
});

// getModuleNamesForTag
describe('module-name-translator', () => {
    it('should get single module name for tag', () => {
        let moduleName = getModuleNamesForTag('00080012');
        expect(moduleName).to.deep.equal(['SOP COMMON MODULE ATTRIBUTES']);
    })

    it('should get undefined module name for tag', () => {
        let moduleName = getModuleNamesForTag('00070016');
        expect(moduleName).to.deep.equal(['Undefined module group']);
    })

    it('should get multiple module names for tag', () => {
        let moduleName = getModuleNamesForTag('0040a0b0');
        expect(moduleName).to.deep.equal([
            'Waveform Annotation Module Attributes',
            'Waveform Module Attributes'
        ]);
    })
});
describe('dicom-entry-converter-sortDicomEntries', () => {
    it('should sort Dicom entries', () => {

        let originalEntries: DicomEntry[] = [
            {
                tagGroup: '0008',
                tagElement: '0002',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000'

            },
            {
                tagGroup: '0008',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000'

            },
            {
                tagGroup: '0008',
                tagElement: '0001',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000'

            },
            {
                tagGroup: '0002',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000'

            },
            {
                tagGroup: '0003',
                tagElement: '0006',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000'

            }
        ];

        let expectedEntries: DicomEntry[] = [
            {
                tagGroup: '0002',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000'

            },
            {
                tagGroup: '0003',
                tagElement: '0006',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000'

            },
            {
                tagGroup: '0008',
                tagElement: '0001',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000'

            },
            {
                tagGroup: '0008',
                tagElement: '0002',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000'

            },
            {
                tagGroup: '0008',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000'

            }
        ];

        let sortedEntries = sortDicomEntries(originalEntries);
        expect(sortedEntries).to.deep.equal(expectedEntries);
    })

    it('should sort empty array to empty array', () => {
        let originalEntries: DicomEntry[] = [

        ];

        let expectedEntries: DicomEntry[] = [

        ];

        let sortedEntries = sortDicomEntries(originalEntries);
        expect(sortedEntries).to.deep.equal(expectedEntries);
    })
});