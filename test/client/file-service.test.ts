import { ApplicationStateReducer } from './../../src/client/application-state';
import { FileService, FileContent } from './../../src/client/components/file-loader/file-service';
import { expect } from 'chai';

import * as fs from 'fs';

describe('file-service processLoadedFiles', () => {
    it('should get error, cannot parse dicom from invalid buffer', () => {
        let reducer = new ApplicationStateReducer();
        let fileService = new FileService(reducer);
        const promises = [
            new Promise<FileContent>(resolve => {
                resolve({
                    buffer: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]),
                    fileName: 'test123',
                    fileSize: 10
                });
            })
        ];

        return fileService.processLoadedFiles(promises)
            .catch(err => {
                expect(err).to.be.an.instanceof(Error);
            });
    });

    it('should return 1 instance', () => {
        let reducer = new ApplicationStateReducer();
        let fileService = new FileService(reducer);
        const data: Buffer = fs.readFileSync('./test/client/mocks/CT1_UNC.explicit_big_endian.dcm');
        const promises = [
            new Promise<FileContent>(resolve => {
                resolve({
                    buffer: data,
                    fileName: 'test123',
                    fileSize: 10
                });
            })
        ];

        return fileService.processLoadedFiles(promises)
            .then(files => {
                expect(files.length).to.be.equal(1);
            });
    });

    it('should return ', () => {
        let reducer = new ApplicationStateReducer();
        let fileService = new FileService(reducer);
        const data: Buffer = fs.readFileSync('./test/client/mocks/CT1_UNC.explicit_big_endian.dcm');
        const promises = [
            new Promise<FileContent>(resolve => {
                resolve({
                    buffer: data,
                    fileName: 'test123',
                    fileSize: 10
                });
            })
        ];

        return fileService.processLoadedFiles(promises)
            .then(files => {
                expect(files[0]).to.be.an('object').that.has.all.keys('fileName', 'fileSize', 'bufferedData', 'dicomData', 'timestamp');
            })
    });
});
