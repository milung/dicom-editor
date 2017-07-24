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
                    tagVM: '2'
                },
                {
                    tagGroup: '0007',
                    tagElement: '0016',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2'
                },
                {
                    tagGroup: '0012',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2'
                }
            ]
        };

        let expectedDicomExtended: DicomExtendedData = {
            'EightModule': [
                {
                    tagGroup: '0008',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2'
                }
            ],

            'ExtendedEightModule': [
                {
                    tagGroup: '0008',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2'
                },
                {
                    tagGroup: '0012',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2'
                }
            ],

            'SevenModule': [
                {
                    tagGroup: '0007',
                    tagElement: '0016',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2'
                }
            ],

            'TwelveModule': [
                {
                    tagGroup: '0012',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2'
                }
            ]
        };
        let resultDicom = convertSimpleDicomToExtended(dicomSimple);
        expect(resultDicom).to.deep.equal(expectedDicomExtended);
    });
});

// getModuleNamesForTag
describe('module-name-translator', () => {
    it('should get group name for tag', () => {
        let moduleName = getModuleNamesForTag('00080012');
        expect(moduleName).to.deep.equal(['EightModule', 'ExtendedEightModule']);
    })

    it('should get group name for tag', () => {
        let moduleName = getModuleNamesForTag('00070016');
        expect(moduleName).to.deep.equal(['SevenModule']);
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

            },
            {
                tagGroup: '0008',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',

            },
            {
                tagGroup: '0008',
                tagElement: '0001',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',

            },
            {
                tagGroup: '0002',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',

            },
            {
                tagGroup: '0003',
                tagElement: '0006',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',

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

            },
            {
                tagGroup: '0003',
                tagElement: '0006',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',

            },
            {
                tagGroup: '0008',
                tagElement: '0001',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',

            },
            {
                tagGroup: '0008',
                tagElement: '0002',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',

            },
            {
                tagGroup: '0008',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',

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