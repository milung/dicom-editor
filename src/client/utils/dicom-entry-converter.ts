import { DicomExtendedData, DicomSimpleData } from './../model/dicom-entry';
import { getModuleNamesForTag } from './module-name-translator';

export function convertSimpleDicomToExtended(simpleDicom: DicomSimpleData): DicomExtendedData {
    let result: DicomExtendedData = {
    };

    for (let dicomEntry of simpleDicom.entries) {
        let moduleNames = getModuleNamesForTag(dicomEntry.tagGroup + dicomEntry.tagElement);

        for (let moduleName of moduleNames) {
            // module is in result array already
            if (result[moduleName]) {
                result[moduleName].push(dicomEntry);
            } else { // create new module with dicom entry
                result[moduleName] = [dicomEntry];
            }
        }
    }

    // sort here
    return result;
}