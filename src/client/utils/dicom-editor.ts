import { DicomEntry } from '../model/dicom-entry';
import { EditTags } from '../model/edit-interface';
import { ChangeType } from '../model/edit-interface';
import { HeavyweightFile } from '../model/file-interfaces';

// to do: sequence check (if the tag is part of sequence, seq. length needs to be updated)
// comments
// tests
// doesn't update dicom entries, only the buffer

interface Sequence {
    entry: DicomEntry,
    length: number
}

export class DicomEditor {

    public insertTag(buffer: Uint8Array, tag: Uint8Array, offset: number) {
        let buffer1 = buffer.slice(0, offset);
        let buffer2 = buffer.slice(offset, );
        let buffer3 = this.concatBuffers(buffer1, tag);
        return this.concatBuffers(buffer3, buffer2);
    }

    public removeTag(buffer: Uint8Array, tag: DicomEntry) {
        let buffer1 = buffer.slice(0, tag.offset);
        let buffer2 = buffer.slice(tag.offset + tag.byteLength, );
        return this.concatBuffers(buffer1, buffer2);
    }

    public replaceTag(buffer: Uint8Array, tag: DicomEntry, newTag: Uint8Array) {
        let beginning = buffer.slice(0, tag.offset);
        let end = buffer.slice(tag.offset + tag.byteLength);
        let updatedBuffer = new Uint8Array(beginning.length + newTag.length + end.length);
        updatedBuffer.set(beginning);
        updatedBuffer.set(newTag, beginning.length);
        updatedBuffer.set(end, beginning.length + newTag.length);
        return updatedBuffer;
    }

    public applyAllChanges(file: HeavyweightFile) {
        let buffer = file.bufferedData;
        let changes = file.unsavedChanges || [];
        let sequences: Sequence[] = [];
        if (changes) {
            sequences = this.getSequences(sequences, file.dicomData.entries);
            changes = this.addSequences(changes, sequences);
            changes.sort(
                function (change1: EditTags, change2: EditTags) {
                    return change2.entry.offset - change1.entry.offset;
                });
            changes.forEach(change => {
                if (change.type === ChangeType.ADD) {
                    let newHeader = this.writeTagName(change.entry.tagGroup, change.entry.tagElement);
                    let newTag = this.createTag(newHeader, change.entry);
                    buffer = this.insertTag(buffer, newTag, change.entry.offset);
                    sequences = this.checkSequences(sequences, change, newTag.length);
                } else if (change.type === ChangeType.EDIT) {
                    if (change.entry.tagVR === 'SQ') {
                        let currentSequence = sequences.shift();
                        if (currentSequence && currentSequence.entry.byteLength !== currentSequence.length) {
                            buffer = this.rewriteSQlength(buffer, currentSequence);
                        }
                    } else {
                        let tagName = this.getElementAndGroup(buffer, change.entry.offset);
                        let newTag = this.createTag(tagName, change.entry);
                        buffer = this.replaceTag(buffer, change.entry, newTag);
                        sequences = this.checkSequences(sequences, change, newTag.length);
                    }
                } else if (change.type === ChangeType.REMOVE) {
                    buffer = this.removeTag(buffer, change.entry);
                    sequences = this.checkSequences(sequences, change, 0);
                }
            });
        }
        return buffer;
    }

    public checkSequences(sequences: Sequence[], change: EditTags, newLength: number) {
        sequences.forEach(s => {
            if (s.entry.offset + s.length > change.entry.offset &&
                JSON.stringify(s.entry) !== JSON.stringify(change.entry)) {
                let difference = newLength - change.entry.byteLength;
                s.length = s.length + difference;
            }
        });
        return sequences;
    }

    public rewriteSQlength(buffer: Uint8Array, sequence: Sequence) {
        let beginning = buffer.slice(0, sequence.entry.offset + 6);
        let end = buffer.slice(sequence.entry.offset + 8, );
        let newSQlength = this.writeValueLengthArray(sequence.length);
        let updatedBuffer = new Uint8Array(buffer.length);
        updatedBuffer.set(beginning);
        updatedBuffer.set(newSQlength, beginning.length);
        updatedBuffer.set(end, beginning.length + newSQlength.length);
        return updatedBuffer;
    }

    public createTag(tagName: Uint8Array, tag: DicomEntry) {
        let valueOffset = 8;
        let valueLength = this.getValueLength(tag);

        let tagVR = this.writeVRArray(tag.tagVR);
        let tagLength = this.writeValueLengthArray(valueLength);

        let newTag = new Uint8Array(valueLength + 8);

        newTag.set(tagName);
        newTag.set(tagVR, tagName.length);
        newTag.set(tagLength, tagName.length + tagVR.length);

        switch (tag.tagVR) {
            case 'FD':
                newTag.set(this.writeTypedNumber(parseInt(tag.tagValue, 10), 'double', valueLength), valueOffset);
                break;
            case 'FL':
                newTag.set(this.writeTypedNumber(parseInt(tag.tagValue, 10), 'float', valueLength), valueOffset);
                break;
            case 'UL':
                newTag.set(this.writeTypedNumber(parseInt(tag.tagValue, 10), 'uint32', valueLength), valueOffset);
                break;
            case 'US':
                newTag.set(this.writeTypedNumber(parseInt(tag.tagValue, 10), 'uint16', valueLength), valueOffset);
                break;
            case 'SL':
                newTag.set(this.writeTypedNumber(parseInt(tag.tagValue, 10), 'int32', valueLength), valueOffset);
                break;
            case 'SS':
                newTag.set(this.writeTypedNumber(parseInt(tag.tagValue, 10), 'int16', valueLength), valueOffset);
                break;
            default:
                for (var i = 0; i < tag.tagValue.length; i++) {
                    newTag[i + 8] = tag.tagValue.charCodeAt(i);
                }
                break;
        }
        return newTag;
    }

    private getSequences(sequences: Sequence[], entries: DicomEntry[]) {
        entries.forEach(entry => {
            if (entry.tagVR === 'SQ') {
                sequences.push({ entry: entry, length: entry.byteLength });
            }
        });
        sequences.sort(
            function (s1: Sequence, s2: Sequence) {
                return s2.entry.offset - s1.entry.offset;
            });
        return sequences;
    }

    private addSequences(changes: EditTags[], sequences: Sequence[]) {
        sequences.forEach(s => {
            changes.push({ entry: s.entry, type: ChangeType.EDIT });
        });
        return changes;
    }

    private getElementAndGroup(buffer: Uint8Array, offset: number): Uint8Array {
        let ElementAndGroupLength = 4;
        let result = buffer.slice(offset, offset + ElementAndGroupLength);
        return result;
    }

    private getValueLength(tag: DicomEntry) {
        let numbers = { 'FD': 8, 'FL': 4, 'UL': 4, 'US': 2, 'SL': 4, 'SS': 2 };
        if (tag.tagVR in numbers) {
            let value = parseInt(tag.tagValue, 10);
            let byteLength = 1;
            /* tslint:disable */
            while ((value >>= 8) > 0) {
                /* tslint:enable */
                byteLength++;
            }
            switch (tag.tagVR[1]) {
                case 'S':
                    byteLength += (2 - byteLength % 2);
                    break;
                case 'L':
                    byteLength += (4 - byteLength % 4);
                    break;
                case 'D':
                    byteLength += (8 - byteLength % 8);
                    break;
                default:
                    break;
            }
            return byteLength;
        } else {
            return tag.tagValue.length;
        }
    }

    private writeTagName(tagGroup: string, tagElement: string) {
        let elementOrGroupLength = 2;
        let group = this.writeTypedNumber(parseInt(tagGroup, 16), 'uint16', elementOrGroupLength);
        let element = this.writeTypedNumber(parseInt(tagElement, 16), 'uint16', elementOrGroupLength);
        let tagName = new Uint8Array(elementOrGroupLength * 2);
        tagName.set(group);
        tagName.set(element, elementOrGroupLength);
        return tagName;
    }

    private writeVRArray(vr: string) {
        let vrArray = new Uint8Array(2);
        for (var i = 0; i < 2; i++) {
            vrArray[i] = vr.charCodeAt(i);
        }
        return vrArray;
    }

    private writeValueLengthArray(length: number) {
        return this.writeTypedNumber(length, 'uint16', 2);
    }

    private writeTypedNumber(num: number, type: string, arrayLength: number) {
        let arrbuff = new ArrayBuffer(arrayLength);
        let view = new DataView(arrbuff);
        switch (type) {
            case 'uint16':
                view.setUint16(0, num, true);
                break;
            case 'uint32':
                view.setUint16(0, num, true);
                break;
            case 'int8':
                view.setInt8(0, num);
                break;
            case 'int16':
                view.setInt16(0, num, true);
                break;
            case 'int32':
                view.setInt32(0, num, true);
                break;
            case 'float':
                view.setFloat32(0, num, true);
                break;
            case 'double':
                view.setFloat64(0, num, true);
                break;
            default:
                break;
        }
        return new Uint8Array(arrbuff);
    }

    private concatBuffers(bufffer1: Uint8Array, buffer2: Uint8Array): Uint8Array {
        let concatedBuffer = new Uint8Array(bufffer1.length + buffer2.length);
        concatedBuffer.set(bufffer1);
        concatedBuffer.set(buffer2, bufffer1.length);
        return concatedBuffer;
    }

}