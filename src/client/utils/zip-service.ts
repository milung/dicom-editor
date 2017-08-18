import { ApplicationStateReducer } from '../application-state';
import { dicomDataToExcel } from './excel-export/dicom-table-exporter';
import { getImageFile } from './image-file-maker';
import { ExportMetadata } from '../model/export-interfaces';
import { SelectedFile } from '../model/file-interfaces';
import { HeavyweightFile } from '../model/file-interfaces';
import { saveAs } from 'file-saver';
import { DicomReader } from './dicom-reader';
var JSZip = require('jszip');

import * as cornerstone from '../../assets/js/cornerstone-library/cornerstone.js';
var cornerstoneWADOImageLoader = require('../components/image-viewer/cornerstone-library/DCMLoader');

/**
 * @description Zip files
 * @param data Contains information about what the user wants to download
 * @param reducer 
 * @return Images/excel in zip file
 */

export class Zipper {
    private zip = JSZip();

    private dicomImage: JSZip;
    private dicomData: JSZip;

    private numFrames: number = 0;
    private numberPicture: number = 0;
    private numberOfFiles: number = 0;

    async generateCompleteZip(data: ExportMetadata, reducer: ApplicationStateReducer) {
        this.numberOfFiles = reducer.getState().selectedFiles.length;
        let filesToProcess: SelectedFile[] = [];

        if (this.numberOfFiles === 0) {
            let current = reducer.getState().currentFile;
            if (current) {
                let selected = {
                    colour: 'useles',
                    selectedFile: current
                };
                filesToProcess = current ? [selected] : [];
                this.numberOfFiles = 1;
            }
        } else {
            filesToProcess = reducer.getState().selectedFiles;
        }

        for (var i = 0; i < this.numberOfFiles; i++) {
            let dataToProcessing: SelectedFile = filesToProcess[i];
            this.createStructureZip(i + 1);
            await this.zipSelectedFile(data, dataToProcessing.selectedFile, this.numberOfFiles);
            reducer.setCurentExportFileNumber(i + 1);
        }
        await this.generateZip();
    }

    async sleep(time: number) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), time);
        });
    }

    private createStructureZip(numberFolder: number) {
        this.dicomImage = this.zip.folder('File' + numberFolder).folder('DicomImage');
        this.dicomData = this.zip.folder('File' + numberFolder).folder('DicomData');
    }

    private async zipSelectedFile(
        data: ExportMetadata, dataToProcessing: HeavyweightFile, numberOfFiles: number) {

        this.numberPicture = 0;

        if (data.excel && data.image) {
            await this.excelToZip(dataToProcessing);
            await this.imagesToZip(dataToProcessing);
        } else if ((!data.excel) && (data.image)) {
            await this.imagesToZip(dataToProcessing);
        } else if ((data.excel) && (!data.image)) {
            await this.excelToZip(dataToProcessing);
        }
    }

    private generateZip() {
        this.zip.generateAsync({ type: 'blob' }).then(function (content: Blob) {
            saveAs(content, 'Dicom.zip');
        });
    }

    private async imagesToZip(dataToProcessing: HeavyweightFile) {
        let dicomReader: DicomReader = new DicomReader();
        if (dataToProcessing) {
            this.numFrames = dicomReader.getNumberOfFrames(dataToProcessing.bufferedData);

            for (var num = 0; num <= this.numFrames - 1; num++) {
                await this.sleep(150);
                await this.renderCanvas(dataToProcessing.bufferedData, num);
            }
            await this.sleep(150);
            await this.renderCanvas(dataToProcessing.bufferedData, 0);
            await this.sleep(150);
        }
    }

    private async excelToZip(dataToProcessing: HeavyweightFile) {
        if (dataToProcessing) {
            this.dicomData.file('dicomData.xlsx', dicomDataToExcel(dataToProcessing), { binary: true });
        }
    }

    private async renderCanvas(data: Uint8Array, frameIndex: number) {
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
        if (this.numberPicture > 0) {
            this.dicomImage.file(
                'dicomImage' + this.numberPicture.toString() + '.png', getImageFile(), { binary: true });
        }
        this.numberPicture++;
    }
}