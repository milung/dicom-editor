import { LightweightFile, HeavyweightFile } from './../../src/client/model/file-interfaces';
import { ApplicationStateReducer } from './../../src/client/application-state';
import { FileStorage, DatabaseEntry } from './../../src/client/utils/file-storage';
import { expect } from 'chai';

// getFileSizeFromDbKey
describe('file-storage', () => {
    it('should get file size from DbKey string', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);
        let fileSize = fileStorage.getFileSizeFromDbKey('CT1_UNC.explicit_big_endian (1).dcm_530648');
        expect(fileSize).to.equal(530648);
    });

    it('should get file size from DbKey string', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);
        let fileSize = fileStorage.getFileSizeFromDbKey('test-file_name_123.dcm_98765');
        expect(fileSize).to.equal(98765);
    });
});

// findIndexOfFileToUpdate
describe('file-storage', () => {
    it('should not find index in empty array and return -1', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);

        let index = fileStorage.findIndexOfFileToUpdate('CT1_UNC.explicit_big_endian (1).dcm_530648', []);
        expect(index).to.equal(-1);
    });

    it('should find index of file to update in array of length 1', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);

        let lightFile1: LightweightFile = {
            fileName: 'CT1_UNC.explicit_big_endian (1).dcm',
            dbKey: 'CT1_UNC.explicit_big_endian (1).dcm_530648',
            timestamp: 123
        }

        let index = fileStorage.findIndexOfFileToUpdate('CT1_UNC.explicit_big_endian (1).dcm_530648', [lightFile1]);

        expect(index).to.equal(0);
    });

    it('should find index of file to update in array', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);

        let lightFile1: LightweightFile = {
            fileName: 'CT1_UNC.explicit_big_endian (1).dcm',
            dbKey: 'CT1_UNC.explicit_big_endian (1).dcm_530648',
            timestamp: 123
        }

        let lightFile2: LightweightFile = {
            fileName: 'CT.dcm',
            dbKey: 'CT.dcm_123',
            timestamp: 123
        }

        let lightFile3: LightweightFile = {
            fileName: 'test.dcm',
            dbKey: 'test.dcm_789',
            timestamp: 123
        }

        let index = fileStorage.findIndexOfFileToUpdate('test.dcm_789', [lightFile1, lightFile2, lightFile3]);

        expect(index).to.equal(2);
    });
});

// findOldestFileIndex
describe('file-storage', () => {
    it('should find oldest file index to delete', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);

        let lightFile1: LightweightFile = {
            fileName: 'CT1_UNC.explicit_big_endian (1).dcm',
            dbKey: 'CT1_UNC.explicit_big_endian (1).dcm_530648',
            timestamp: 1
        }

        let lightFile2: LightweightFile = {
            fileName: 'CT.dcm',
            dbKey: 'CT.dcm_123',
            timestamp: 2
        }

        let lightFile3: LightweightFile = {
            fileName: 'test.dcm',
            dbKey: 'test.dcm_789',
            timestamp: 3
        }

        let index = fileStorage.findOldestFileIndex([lightFile1, lightFile2, lightFile3]);

        expect(index).to.equal(0);
    });

    it('should find oldest file index to delete', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);

        let lightFile1: LightweightFile = {
            fileName: 'CT1_UNC.explicit_big_endian (1).dcm',
            dbKey: 'CT1_UNC.explicit_big_endian (1).dcm_530648',
            timestamp: 3
        }

        let lightFile2: LightweightFile = {
            fileName: 'CT.dcm',
            dbKey: 'CT.dcm_123',
            timestamp: 2
        }

        let lightFile3: LightweightFile = {
            fileName: 'test.dcm',
            dbKey: 'test.dcm_789',
            timestamp: 1
        }

        let index = fileStorage.findOldestFileIndex([lightFile1, lightFile2, lightFile3]);

        expect(index).to.equal(2);
    });

    it('should find oldest file index to delete', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);

        let lightFile1: LightweightFile = {
            fileName: 'CT1_UNC.explicit_big_endian (1).dcm',
            dbKey: 'CT1_UNC.explicit_big_endian (1).dcm_530648',
            timestamp: 1
        }

        let index = fileStorage.findOldestFileIndex([lightFile1]);

        expect(index).to.equal(0);
    });
});

// prepareDatabaseEntry
describe('file-storage', () => {
    it('should prepare DBEntry from heavy file', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);
        let buffer: Uint8Array = new Uint8Array(8);

        let heavyFile: HeavyweightFile = {
            fileName: 'my-name.dcm',
            fileSize: 12345,
            bufferedData: buffer,
            dicomData: {},
            timestamp: 123
        }

        let lightFile: LightweightFile = {
            fileName: 'my-name.dcm',
            dbKey: 'my-name.dcm_12345',
            timestamp: 123
        }

        let dbEntry: DatabaseEntry = {
            fileInterface: lightFile,
            data: buffer,
        }

        let generatedDBEntry = fileStorage.prepareDatabaseEntry(heavyFile);

        expect(generatedDBEntry).to.deep.equal(dbEntry);
    });

    it('should find oldest file index to delete', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);

        let lightFile1: LightweightFile = {
            fileName: 'CT1_UNC.explicit_big_endian (1).dcm',
            dbKey: 'CT1_UNC.explicit_big_endian (1).dcm_530648',
            timestamp: 3
        }

        let lightFile2: LightweightFile = {
            fileName: 'CT.dcm',
            dbKey: 'CT.dcm_123',
            timestamp: 2
        }

        let lightFile3: LightweightFile = {
            fileName: 'test.dcm',
            dbKey: 'test.dcm_789',
            timestamp: 1
        }

        let index = fileStorage.findOldestFileIndex([lightFile1, lightFile2, lightFile3]);

        expect(index).to.equal(2);
    });

    it('should find oldest file index to delete', () => {
        let reducer = new ApplicationStateReducer();
        let fileStorage = new FileStorage(reducer);

        let lightFile1: LightweightFile = {
            fileName: 'CT1_UNC.explicit_big_endian (1).dcm',
            dbKey: 'CT1_UNC.explicit_big_endian (1).dcm_530648',
            timestamp: 1
        }

        let index = fileStorage.findOldestFileIndex([lightFile1]);

        expect(index).to.equal(0);
    });
});