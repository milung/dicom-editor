import { expect } from 'chai';
import { HeavyweightFile } from "../../src/client/model/file-interfaces";
import { DicomSimpleData, DicomEntry } from "../../src/client/model/dicom-entry";
import { EditTags, ChangeType } from "../../src/client/model/edit-interface";
import { DicomEditor } from "../../src/client/utils/dicom-editor";
// import { DicomReader } from "../../src/client/utils/dicom-reader";

describe('dicom-editor', () => {

    var dicomEditor: DicomEditor = new DicomEditor();

    it('should remove a tag from the beginning of the buffer', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[0],
            type: ChangeType.REMOVE
        };
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        expect(result.length).to.equal(file.bufferedData.length - 10);
        expect(result).to.eql(file.bufferedData.slice(10, ));
    });

    it('should remove a tag from the middle of the buffer', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[1],
            type: ChangeType.REMOVE
        };
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        expect(result.length).to.equal(file.bufferedData.length - 13);
        expect(result.slice(0, 10)).to.eql(file.bufferedData.slice(0, 10));
        expect(result.slice(10, )).to.eql(file.bufferedData.slice(23, ));
    });

    it('should remove a tag from the end of the buffer', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[3],
            type: ChangeType.REMOVE
        };
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        expect(result.length).to.equal(file.bufferedData.length - 10);
        expect(result).to.eql(file.bufferedData.slice(0, change.entry.offset));
    });

    it('should remove tag from the beginning and end of the buffer (should sort the changes)', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change1: EditTags = {
            entry: file.dicomData.entries[0],
            type: ChangeType.REMOVE
        };
        let change2: EditTags = {
            entry: file.dicomData.entries[3],
            type: ChangeType.REMOVE
        };
        file.unsavedChanges = [change1, change2];
        let result = dicomEditor.applyAllChanges(file);
        expect(result.length).to.equal(file.bufferedData.length - 20);
        expect(result).to.eql(file.bufferedData.slice(10, change2.entry.offset));
    });

    it('should edit a tag - change VR', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[0],
            type: ChangeType.EDIT
        };
        change.entry.tagVR = 'FE';
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        expect(result[4] = change.entry.tagVR.charCodeAt(0));
        expect(result[5] = change.entry.tagVR.charCodeAt(1));
    });

    it('should edit a tag without changing length- change VR - only 2 bytes', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[0],
            type: ChangeType.EDIT
        };
        change.entry.tagVR = 'FE';
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        expect(result.length).to.equal(file.bufferedData.length);
        expect(result.slice(0, 4)).to.eql(file.bufferedData.slice(0, 4));
        expect(result.slice(6, )).to.eql(file.bufferedData.slice(6, ));
    });

    it('should change bytelength when editing string value of a tag', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[0],
            type: ChangeType.EDIT
        };
        change.entry.tagValue = 'fiha';
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        expect(result.length).to.equal(file.bufferedData.length + 2);
    });

    it('should change value when editing string value of a tag', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[0],
            type: ChangeType.EDIT
        };
        change.entry.tagValue = 'fiha';
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        expect(result[8] = change.entry.tagValue.charCodeAt(0));
        expect(result[9] = change.entry.tagValue.charCodeAt(1));
        expect(result[10] = change.entry.tagValue.charCodeAt(2));
        expect(result[11] = change.entry.tagValue.charCodeAt(3));
    });

    it('shouldnt change nothing except the tag value', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[0],
            type: ChangeType.EDIT
        };
        change.entry.tagValue = 'fiha';
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        expect(result.slice(0, 6)).to.eql(file.bufferedData.slice(0, 6));
        expect(result.slice(12, )).to.eql(file.bufferedData.slice(10, ));
    });

    it('should update value length when editing string value', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[0],
            type: ChangeType.EDIT
        };
        change.entry.tagValue = 'fiha';
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        let diffInLength = change.entry.tagValue.length - file.bufferedData[6];
        expect(result[6]).to.eql(file.bufferedData[6] + diffInLength);
        expect(result[6] = change.entry.tagValue.length);
    });

    it('should change number to string representation when VR changed from SS to AD', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[3],
            type: ChangeType.EDIT
        };
        change.entry.tagVR = "AD";
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        expect(result[change.entry.offset + 6]).to.eql(3);
        expect(result[change.entry.offset + 8]).to.eql(change.entry.tagValue.charCodeAt(0));
    });

    it('should change string to float representation when VR changed to UL', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[0],
            type: ChangeType.EDIT
        };
        change.entry.tagVR = "UL";
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        expect(result[6]).to.eql(4);
        expect(result[8]).to.eql(parseInt(change.entry.tagValue));
    });

    it('should update SQ length when removing a tag from the sequence', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[2].sequence[0],
            type: ChangeType.REMOVE
        };
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        let sqLengthOffset = file.dicomData.entries[2].offset + 6;
        let oldSQlength = file.dicomData.entries[2].byteLength;
        expect(result[sqLengthOffset]).to.eql(oldSQlength - change.entry.byteLength);
    });

    it('should update SQ length when editing the last tag of a sequence', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[2].sequence[1],
            type: ChangeType.EDIT
        };
        change.entry.tagValue = "abcd";
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        let sqLengthOffset = file.dicomData.entries[2].offset + 6;
        let oldSQlength = file.dicomData.entries[2].byteLength;
        expect(result[sqLengthOffset]).to.eql(oldSQlength + 2);
    });

    it('should delete the whole sequence', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[2],
            type: ChangeType.REMOVE
        };
        file.unsavedChanges = [change];
        let result = dicomEditor.applyAllChanges(file);
        let oldSQlength = file.dicomData.entries[2].byteLength;
        expect(result.length).to.eql(file.bufferedData.length - oldSQlength);
        let sqOffset = file.dicomData.entries[2].offset;
        expect(result.slice(0, sqOffset)).to.eql(file.bufferedData.slice(0, sqOffset));
        expect(result.slice(sqOffset, )).to.eql(file.bufferedData.slice(sqOffset + oldSQlength, ));
    });

    it('should get 3 SQces from nested sqs', () => {
        let entries = prepareNestedSequences();
        let result = dicomEditor.getSequences([], entries);
        expect(result.length).to.equal(3);
    });

    it('should edit tag within a sq and delete the sq then', () => {
        let file: HeavyweightFile = prepareAHeavyweightFile();
        let change: EditTags = {
            entry: file.dicomData.entries[2],
            type: ChangeType.REMOVE
        };
        let change2: EditTags = {
            entry: file.dicomData.entries[2].sequence[1],
            type: ChangeType.EDIT
        }
        change2.entry.tagValue = "aaju";
        file.unsavedChanges = [change, change2];
        let result = dicomEditor.applyAllChanges(file);
        let oldSQlength = file.dicomData.entries[2].byteLength;
        expect(result.length).to.eql(file.bufferedData.length - oldSQlength);
        let sqOffset = file.dicomData.entries[2].offset;
        expect(result.slice(0, sqOffset)).to.eql(file.bufferedData.slice(0, sqOffset));
        expect(result.slice(sqOffset, )).to.eql(file.bufferedData.slice(sqOffset + oldSQlength, ));
    });

});

function prepareAHeavyweightFile() {
    let data: DicomSimpleData = {
        entries:
        [
            {
                id: 1,
                offset: 0,
                byteLength: 10,
                tagGroup: '0001',
                tagElement: '0025',
                tagName: 'patient info',
                tagValue: '12',
                tagVR: 'PI',
                tagVM: '1',
                colour: 'black',
                sequence: []
            },
            {
                id: 2,
                offset: 10,
                byteLength: 13,
                tagGroup: '0001',
                tagElement: '0028',
                tagName: 'patients name',
                tagValue: 'Janko',
                tagVR: 'PN',
                tagVM: '1',
                colour: 'black',
                sequence: []
            },
            {
                id: 3,
                offset: 23,
                byteLength: 28,
                tagGroup: '0002',
                tagElement: '0001',
                tagName: 'sequence',
                tagValue: '',
                tagVR: 'SQ',
                tagVM: '0',
                colour: 'black',
                sequence: [
                    {
                        id: 31,
                        offset: 31,
                        byteLength: 10,
                        tagGroup: '0002',
                        tagElement: '0011',
                        tagName: 'seq one',
                        tagValue: '12',
                        tagVR: 'NU',
                        tagVM: '1',
                        colour: 'black',
                        sequence: []
                    },
                    {
                        id: 32,
                        offset: 41,
                        byteLength: 10,
                        tagGroup: '0002',
                        tagElement: '0012',
                        tagName: 'seq two',
                        tagValue: 'ab',
                        tagVR: 'NE',
                        tagVM: '1',
                        colour: 'black',
                        sequence: []
                    }
                ]
            },
            {
                id: 4,
                offset: 51,
                byteLength: 10,
                tagGroup: '0002',
                tagElement: '0025',
                tagName: 'other info',
                tagValue: '125',
                tagVR: 'SS',
                tagVM: '1',
                colour: 'black',
                sequence: []
            }
        ]
    }
    let array = new Uint8Array(61);
    array[0] = 1;
    array[1] = 0;
    array[2] = 25;
    array[3] = 0;
    array[4] = 80;
    array[5] = 73;
    array[6] = 2;
    array[7] = 0;
    array[8] = 49;
    array[9] = 50;
    array[10] = 1;
    array[11] = 0;
    array[12] = 28;
    array[13] = 0;
    array[14] = 80;
    array[15] = 78;
    array[16] = 5;
    array[17] = 0;
    array[18] = 74;
    array[19] = 97;
    array[20] = 110;
    array[21] = 107;
    array[22] = 111;
    array[23] = 2;
    array[24] = 0;
    array[25] = 1;
    array[26] = 0;
    array[27] = 83;
    array[28] = 81;
    array[29] = 20;
    array[30] = 0;
    array[31] = 2;
    array[32] = 0;
    array[33] = 11;
    array[34] = 0;
    array[35] = 78;
    array[36] = 85;
    array[37] = 2;
    array[38] = 0;
    array[39] = 49;
    array[40] = 50;
    array[41] = 2;
    array[42] = 0;
    array[43] = 12;
    array[44] = 0;
    array[45] = 78;
    array[46] = 69;
    array[47] = 2;
    array[48] = 0;
    array[49] = 97;
    array[50] = 98;
    array[51] = 2;
    array[52] = 0;
    array[53] = 25;
    array[54] = 0;
    array[55] = 53;
    array[56] = 53;
    array[57] = 2;
    array[58] = 0;
    array[59] = 125;
    array[60] = 0;

    let file: HeavyweightFile = {
        fileSize: 0,
        bufferedData: array,
        dicomData: data,
        fileName: 'a.dcm',
        timestamp: 12345
    }

    return file;
}

function prepareNestedSequences() {
    let entries: DicomEntry[] = [
        {
            id: 1,
            offset: 0,
            byteLength: 10,
            tagGroup: '0001',
            tagElement: '0025',
            tagName: 'patient info',
            tagValue: '12',
            tagVR: 'SQ',
            tagVM: '1',
            colour: 'black',
            sequence: [
                {
                    id: 2,
                    offset: 15,
                    byteLength: 10,
                    tagGroup: '0001',
                    tagElement: '0025',
                    tagName: 'patient info',
                    tagValue: '12',
                    tagVR: 'PI',
                    tagVM: '1',
                    colour: 'black',
                    sequence: []
                },
                {
                    id: 3,
                    offset: 7,
                    byteLength: 10,
                    tagGroup: '0001',
                    tagElement: '0025',
                    tagName: 'patient info',
                    tagValue: '12',
                    tagVR: 'SQ',
                    tagVM: '1',
                    colour: 'black',
                    sequence: [
                        {
                            id: 4,
                            offset: 0,
                            byteLength: 10,
                            tagGroup: '0001',
                            tagElement: '0025',
                            tagName: 'patient info',
                            tagValue: '12',
                            tagVR: 'PI',
                            tagVM: '1',
                            colour: 'black',
                            sequence: []
                        },
                        {
                            id: 5,
                            offset: 4,
                            byteLength: 10,
                            tagGroup: '0001',
                            tagElement: '0025',
                            tagName: 'patient info',
                            tagValue: '12',
                            tagVR: 'SQ',
                            tagVM: '1',
                            colour: 'black',
                            sequence: [
                                {
                                    id: 6,
                                    offset: 0,
                                    byteLength: 10,
                                    tagGroup: '0001',
                                    tagElement: '0025',
                                    tagName: 'patient info',
                                    tagValue: '12',
                                    tagVR: 'PI',
                                    tagVM: '1',
                                    colour: 'black',
                                    sequence: []
                                }]
                        }
                    ]
                }
            ]
        },
        {
            id: 7,
            offset: 0,
            byteLength: 10,
            tagGroup: '0001',
            tagElement: '0025',
            tagName: 'patient info',
            tagValue: '12',
            tagVR: 'PI',
            tagVM: '1',
            colour: 'black',
            sequence: []
        }
    ];
    return entries;
}