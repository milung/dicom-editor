import { HeavyweightFile, LightweightFile } from './../../src/client/model/file-interfaces';
import { expect } from 'chai';
import { convertHeavyToLight } from '../../src/client/utils/file-store-util';
describe('file-store convertHeavyToLight', () => {
    it('should convert heavy file into light file', () => {
        let heavy: HeavyweightFile = {
            fileName: 'someName',
            timestamp: 1,
            fileSize: 1,
            bufferedData: new Uint8Array(0),
            dicomData: {
                entries: [
                    {
                        tagGroup: 'gr',
                        tagElement: '52',
                        tagName: 'name',
                        tagValue: 'val',
                        tagVR: 'vr',
                        tagVM: 'vm',
                        colour: 'red',
                        sequence: []
                    }
                ]
            }
        }

        let light: LightweightFile = {
            dbKey: 'someName',
            fileName: 'someName',
            timestamp: 1,
        }

        expect(light).to.deep.equal(convertHeavyToLight(heavy));
    });

    it('should convert heavy file into light file', () => {
        let heavy: HeavyweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            fileSize: 123,
            bufferedData: new Uint8Array(8),
            dicomData: {
                entries: [

                ]
            }
        }

        let light: LightweightFile = {
            dbKey: 'name',
            fileName: 'name',
            timestamp: 123456789,
        }

        expect(light).to.deep.equal(convertHeavyToLight(heavy));
    });
});