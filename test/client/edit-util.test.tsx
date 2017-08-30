import { expect } from 'chai';
import { DicomEntry } from "../../src/client/model/dicom-entry";
import { findEntryById, findHighestID } from "../../src/client/utils/edit-util";

describe('EditUtil->findEntryById()', () => {
    it('should return undefined for non existing id', () => {

        let resultEntry: DicomEntry = {
            id: 2,
            offset: 12345,
            byteLength: 0,
            tagGroup: '0007',
            tagElement: '0016',
            tagName: 'MY TAG',
            tagValue: 'TAG VALUE',
            tagVR: 'AA',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        }

        let entries: DicomEntry[] = [
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            },
            resultEntry,
            {
                id: 3,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0012',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ];

        expect(findEntryById({ entries: entries }, 7)).to.equal(undefined);
    });

    it('should find entry by id that is not in sequence', () => {

        let resultEntry: DicomEntry = {
            id: 2,
            offset: 12345,
            byteLength: 0,
            tagGroup: '0007',
            tagElement: '0016',
            tagName: 'MY TAG',
            tagValue: 'TAG VALUE',
            tagVR: 'AA',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        }

        let entries: DicomEntry[] = [
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            },
            resultEntry,
            {
                id: 3,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0012',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ];

        expect(findEntryById({ entries: entries }, 2)).to.equal(resultEntry);
    });

    it('should find entry by id that is in sequence', () => {

        let resultEntry: DicomEntry = {
            id: 2,
            offset: 12345,
            byteLength: 0,
            tagGroup: '0007',
            tagElement: '0016',
            tagName: 'MY TAG',
            tagValue: 'TAG VALUE',
            tagVR: 'AA',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        }

        let entries: DicomEntry[] = [
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: [
                    resultEntry
                ]
            },
            {
                id: 3,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0012',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ];

        expect(findEntryById({ entries: entries }, 2)).to.equal(resultEntry);
    });

    it('should find entry by id that is in sequence in depth equal to 2', () => {

        let resultEntry: DicomEntry = {
            id: 3,
            offset: 12345,
            byteLength: 0,
            tagGroup: '0007',
            tagElement: '0016',
            tagName: 'MY TAG',
            tagValue: 'TAG VALUE',
            tagVR: 'AA',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        }

        let entries: DicomEntry[] = [
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: [
                    {
                        id: 2,
                        offset: 12345,
                        byteLength: 0,
                        tagGroup: '0012',
                        tagElement: '0012',
                        tagName: 'MY TAG',
                        tagValue: 'TAG VALUE',
                        tagVR: 'AA',
                        tagVM: '2',
                        colour: '#000000',
                        sequence: [
                            resultEntry
                        ]
                    }
                ]
            }
        ];

        expect(findEntryById({ entries: entries }, 3)).to.equal(resultEntry);
    });
});

describe('EditUtil->findHighestID()', () => {
    it('should find highest id', () => {

        let resultEntry: DicomEntry = {
            id: 2,
            offset: 12345,
            byteLength: 0,
            tagGroup: '0007',
            tagElement: '0016',
            tagName: 'MY TAG',
            tagValue: 'TAG VALUE',
            tagVR: 'AA',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        }

        let entries: DicomEntry[] = [
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            },
            resultEntry,
            {
                id: 3,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0012',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ];

        expect(findHighestID({ entries: entries })).to.equal(3);
    });

    it('should find highest id that is not in sequence', () => {

        let resultEntry: DicomEntry = {
            id: 2,
            offset: 12345,
            byteLength: 0,
            tagGroup: '0007',
            tagElement: '0016',
            tagName: 'MY TAG',
            tagValue: 'TAG VALUE',
            tagVR: 'AA',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        }

        let entries: DicomEntry[] = [
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            },
            resultEntry,
            {
                id: 3,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0012',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ];

        expect(findHighestID({ entries: entries })).to.equal(3);
    });

    it('should find highest id that is in sequence', () => {

        let resultEntry: DicomEntry = {
            id: 2,
            offset: 12345,
            byteLength: 0,
            tagGroup: '0007',
            tagElement: '0016',
            tagName: 'MY TAG',
            tagValue: 'TAG VALUE',
            tagVR: 'AA',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        }

        let entries: DicomEntry[] = [
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: [
                    resultEntry
                ]
            },
            {
                id: 3,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0012',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ];

        expect(findHighestID({ entries: entries })).to.equal(3);
    });

    it('should find highest id that is in sequence in depth equal to 2', () => {

        let resultEntry: DicomEntry = {
            id: 3,
            offset: 12345,
            byteLength: 0,
            tagGroup: '0007',
            tagElement: '0016',
            tagName: 'MY TAG',
            tagValue: 'TAG VALUE',
            tagVR: 'AA',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        }

        let entries: DicomEntry[] = [
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0012',
                tagName: 'MY TAG',
                tagValue: 'TAG VALUE',
                tagVR: 'AA',
                tagVM: '2',
                colour: '#000000',
                sequence: [
                    {
                        id: 2,
                        offset: 12345,
                        byteLength: 0,
                        tagGroup: '0012',
                        tagElement: '0012',
                        tagName: 'MY TAG',
                        tagValue: 'TAG VALUE',
                        tagVR: 'AA',
                        tagVM: '2',
                        colour: '#000000',
                        sequence: [
                            resultEntry
                        ]
                    }
                ]
            }
        ];

        expect(findHighestID({ entries: entries })).to.equal(3);
    });
});