
import { ApplicationStateReducer } from '../application-state';
import { dicomDataToExcel } from './dicom-table-exporter';
import { getImageFile } from './image-file-maker';
import { ExportMetadata } from '../model/export-interfaces';

/**
 * @description download one file or more files in zip
 * @param data 
 * @param reducer 
 */
export function download(data: ExportMetadata, reducer: ApplicationStateReducer) {

    if (data.excel && (!data.image)) {
        var dataToExcel = reducer.getState().currentFile;
        if (dataToExcel) {
            downloadOneItem(dicomDataToExcel(dataToExcel), 'Excel');
        }
    } else if (data.image && (!data.multiframe && !data.excel)) {
        downloadOneItem(getImageFile(), 'Image');
    } else if ((data.excel && data.image) || (data.multiframe && data.image)) {
        // call zipper
    }
}

function downloadOneItem(data: Uint8Array, type: string) {
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
