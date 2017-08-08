
import { ApplicationStateReducer } from '../application-state';
// import { dicomDataToExcel } from './dicom-table-exporter';
import { getImageFile } from './image-file-maker';
import { ExportMetadata } from '../model/export-interfaces';
import { saveAs } from 'file-saver';
import { DicomReader } from './dicom-reader';
var JSZip = require('jszip');

import * as cornerstone from '../../assets/js/cornerstone-library/cornerstone.js';
var cornerstoneWADOImageLoader = require('../components/image-viewer/cornerstone-library/DCMLoader');

/**
 * @description zip files
 * @param data 
 * @param reducer 
 */

export class Zipper {
    private zip = JSZip();
    private dicomImage = this.zip.folder('DicomImage');
    private numFrames: number = 0;
    private numberPicture: number = 0;

    zipp(data: ExportMetadata, reducer: ApplicationStateReducer) {
        this.numberPicture = 0;

        if (data.excel && data.image) {
            if (data.multiframe) {
                this.excelToZip(reducer);
                this.imageToZip(reducer);
            } else {
                this.excelToZip(reducer);
                this.dicomImage.file('dicomImage.png', getImageFile(), { binary: true });

                this.zip.generateAsync({ type: 'blob' }).then(function (content: Blob) {
                    saveAs(content, 'dicom.zip');
                });
            }
        } else if (data.multiframe) {
            this.imageToZip(reducer);
        }
    }

    private async imageToZip(reducer: ApplicationStateReducer) {
        let dicomReader: DicomReader = new DicomReader();

        var element = document.getElementById('dicomImage') as Element;
        cornerstone.enable(element);

        var dataRender = reducer.getState().currentFile;
        if (dataRender) {
            this.numFrames = dicomReader.getNumberOfFrames(dataRender.bufferedData);

            for (var num = 0; num <= this.numFrames - 1; num++) {
                await this.renderHideCanvas(dataRender.bufferedData, num);
            }
            await this.renderHideCanvas(dataRender.bufferedData, 0);
        }
    }

    private async excelToZip(reducer: ApplicationStateReducer) {
        // var dicomData = this.zip.folder('DicomData');
        var dataToExcel = reducer.getState().currentFile;
        if (dataToExcel) {
            // dicomData.file('dicomData.xlsx', dicomDataToExcel(dataToExcel), { binary: true });
        }
    }

    private async renderHideCanvas(data: Uint8Array, frameIndex: number) {
        var imageElement = document.getElementById('dicomImage') as Element;

        var fileNew = new Blob([data], { type: 'File' });

        var imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileNew);
        imageId = imageId + '?frame=' + frameIndex;
        let self = this;
        await cornerstone.loadImage(imageId).then(function (image: Object) {

            var viewport = cornerstone.getDefaultViewport(imageElement.children[0], image);

            cornerstone.displayImage(imageElement, image, viewport);
            self.multiFrameZip();

        });
    }

    private multiFrameZip() {
        var cislo = this.numberPicture;
        if (cislo > 0) {
            this.dicomImage.file(
                'dicomImage' + this.numberPicture.toString() + '.png', getImageFile(), { binary: true });
        }
        if (this.numberPicture === this.numFrames) {
            this.zip.generateAsync({ type: 'blob' }).then(function (content: Blob) {
                saveAs(content, 'dicom.zip');
            });
        }
        this.numberPicture++;
    }

}