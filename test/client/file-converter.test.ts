import { expect } from 'chai';
import { buffersEqual } from '../../src/client/utils/file-converter';

describe('file-converter buffersEqual', () => {
    it('should decide that arrays equal', () => {

        let buffer1: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
        let buffer2: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

        expect(buffersEqual(buffer1, buffer2)).to.equal(true);

    });

    it('should decide that arrays are not equal', () => {

        let buffer1: Uint8Array = new Uint8Array([1, 1, 1, 1, 1, 6, 7, 8, 9, 0]);
        let buffer2: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

        expect(buffersEqual(buffer1, buffer2)).to.equal(false);

    });

    it('should decide that empty arrays are equal', () => {

        let buffer1: Uint8Array = new Uint8Array(0);
        let buffer2: Uint8Array = new Uint8Array(0);

        expect(buffersEqual(buffer1, buffer2)).to.equal(true);

    });
});

