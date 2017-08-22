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

        if ((data.excel && data.image) || (data.dicom && data.excel) || (data.dicom && data.image) ||
            (data.multiframe && data.image) || (selectedFiles > 1)) {
            let zipper = new Zipper();
            zipper.generateCompleteZip(data, reducer);
        } else if (data.excel) {
            if (fileToProcess) {
                await this.downloadOneItem(dicomDataToExcel(fileToProcess), 'Excel', reducer);
                await reducer.setCurentExportFileNumber(1);
            }
        } else if (data.image) {
            if (fileToProcess) {
                let dataToProcessing = fileToProcess.bufferedData;
                await this.renderCanvas(dataToProcessing, 0, reducer);
                await this.renderCanvas(dataToProcessing, 0, reducer);
            }
        } else if (data.dicom) {
            if (fileToProcess) {
                await this.downloadOneItem(fileToProcess.bufferedData, 'Dicom', reducer);
                await reducer.setCurentExportFileNumber(1);
            }
        }
    }

    private async downloadOneItem(data: Uint8Array, type: string, reducer: ApplicationStateReducer) {
        var downloadElement = document.createElement('a');
        document.body.appendChild(downloadElement);
        var blob = new Blob([data], { type: 'octet/stream' });
        var url = window.URL.createObjectURL(blob);
        downloadElement.href = url;
        
        if (type === 'Image') {
            downloadElement.download = 'dicomImage.png';
        } else if (type === 'Excel') {
            downloadElement.download = 'dicomData.xlsx';
        } else if (type === 'Dicom') {
            downloadElement.download = 'dicomFile.dcm';
        }

        downloadElement.click();
        window.URL.revokeObjectURL(url);
        await downloadElement.remove();
    }

    private async renderCanvas(data: Uint8Array, frameIndex: number, reducer: ApplicationStateReducer) {
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
                self.downloadOneItem(getImageFile(), 'Image', reducer);
                reducer.setCurentExportFileNumber(1);
            }
        });
    }
}
