import { HeavyweightFile } from './../model/file-interfaces';

import { ApplicationStateReducer } from '../application-state';
import { dicomDataToExcel } from './excel-export/dicom-table-exporter';
import { getImageFile } from './image-file-maker';
import { ExportMetadata } from '../model/export-interfaces';
import { Zipper } from '../utils/zip-service';
var cornerstoneWADOImageLoader = require('../components/image-viewer/cornerstone-library/DCMLoader');
import * as cornerstone from '../../assets/js/cornerstone-library/cornerstone.js';

/**
 * @description Download one file excel/image or call zip service for more files
 * @param data Contains information about what the user wants to download
 * @param reducer 
 */

export class Downloader {

    private actualImage: number = 0;

    async download(data: ExportMetadata, reducer: ApplicationStateReducer) {
        var selectedFiles: number = reducer.getState().selectedFiles.length;

        let firstSelected = reducer.getState().selectedFiles[0];
        let fileToProcess: HeavyweightFile | undefined;

        if (firstSelected) {
            fileToProcess = firstSelected.selectedFile;
        } else {
            fileToProcess = reducer.getState().currentFile;
            selectedFiles = 1;
        }

        if (data.excel && (!data.image) && (selectedFiles === 1)) {
            if (fileToProcess) {
                this.downloadOneItem(dicomDataToExcel(fileToProcess), 'Excel');
            }
        } else if (data.image && (!data.multiframe && !data.excel) && (selectedFiles === 1)) {
            if (fileToProcess) {
                let dataToProcessing = fileToProcess.bufferedData;
                await this.renderCanvas(dataToProcessing, 0);
                await this.renderCanvas(dataToProcessing, 0);
            }
        } else if ((data.excel && data.image) || (data.multiframe && data.image) || (selectedFiles > 1)) {
            let zipper = new Zipper();
            zipper.generateCompleteZip(data, reducer);
        }
    }

    private downloadOneItem(data: Uint8Array, type: string) {
        var downloadElement = document.createElement('a');
        document.body.appendChild(downloadElement);
        var blob = new Blob([data], { type: 'octet/stream' });
        var url = window.URL.createObjectURL(blob);
        downloadElement.href = url;
        if (type === 'Image') {
            downloadElement.download = 'dicomImage.png';
        } else if (type === 'Excel') {
            downloadElement.download = 'dicomData.xlsx';
        }
        downloadElement.click();
        window.URL.revokeObjectURL(url);
        downloadElement.remove();
    }

    private async renderCanvas(data: Uint8Array, frameIndex: number) {
        var imageElement = document.getElementById('dicomImage') as Element;
        var fileNew = new Blob([data], { type: 'File' });

        var imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileNew);
        imageId = imageId + '?frame=' + frameIndex;
        var self = this;
        await cornerstone.loadImage(imageId).then(function (image: Object) {
            var viewport = cornerstone.getDefaultViewport(imageElement.children[0], image);
            cornerstone.displayImage(imageElement, image, viewport);
            self.actualImage++;
            if (self.actualImage > 1) {
                self.downloadOneItem(getImageFile(), 'Image');
            }
        });
    }
}
