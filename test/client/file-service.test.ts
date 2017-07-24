import { ApplicationStateReducer } from './../../src/client/application-state';
import { FileService, FileContent } from './../../src/client/components/file-loader/file-service';
import { expect } from 'chai';

describe('file-service processLoadedFiles', () => {
    it('should get error, cannot parse dicom from invalid buffer', () => {
        let reducer = new ApplicationStateReducer();
        let fileService = new FileService(reducer);
        const promises = [
            new Promise<FileContent>(resolve=> {
                resolve({
                    buffer: new Uint8Array([1,2,3,4,5,6,7,8,9,0]),
                    fileName: 'test123',
                    fileSize: 10
                });
            })
        ];

        fileService.processLoadedFiles(promises)
        .catch(err => {
            expect(err).to.be.an.instanceof(Error);
        });
    });
});

