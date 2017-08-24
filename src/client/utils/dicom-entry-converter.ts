import {
    DicomExtendedData, DicomSimpleData, DicomEntry,
    DicomExtendedComparisonData, DicomSimpleComparisonData, DicomComparisonData
} from './../model/dicom-entry';
import { getModuleNamesForTag } from './module-name-translator';
import { moduleNameBelongsToSopClass } from './sop-class-handler';

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

    // data is sorted in table
    return result;
}

export function convertSimpleDicomToExtendedComparison(
    simpleDicom: DicomSimpleComparisonData): DicomExtendedComparisonData {
    let result: DicomExtendedComparisonData = {
    };

    for (let comparisonData of simpleDicom.dicomComparisonData) {
        let moduleNames = getModuleNamesForTag(comparisonData.tagGroup + comparisonData.tagElement);

        for (let moduleName of moduleNames) {
            // module is in result array already
            if (result[moduleName]) {
                result[moduleName].push(comparisonData);
            } else { // create new module with dicom entry
                result[moduleName] = [comparisonData];
            }
        }
    }

    // data is sorted in table
    return result;
}

export function sortDicomEntries(entries: DicomEntry[]): DicomEntry[] {
    return entries.sort((elementA, elemenetB) => {
        let groupResult = elementA.tagGroup.localeCompare(elemenetB.tagGroup);

        // if tag groupes are different
        if (groupResult !== 0) {
            return groupResult;
        }

        // if groups equal, sort by tag element
        let groupElement = elementA.tagElement.localeCompare(elemenetB.tagElement);

        return groupElement;
    });
}

export function sortDicomComparisonEntries(entries: DicomComparisonData[]): DicomComparisonData[] {
    return entries.sort((elementA, elemenetB) => {
        let groupResult = elementA.tagGroup.localeCompare(elemenetB.tagGroup);

        // if tag groupes are different
        if (groupResult !== 0) {
            return groupResult;
        }

        // if groups equal, sort by tag element
        let groupElement = elementA.tagElement.localeCompare(elemenetB.tagElement);

        return groupElement;
    });
}

/**
 * @description filters modules that do not belong to given Sop class
 * @param {DicomExtendedData} originalData data to filter
 * @param {string} sopClass clas to filter by
 * @returns {DicomExtendedData} filtered result data containing only modules 
 * that belong to given sop class
 */
export function filterRedundantModulesBySopClass(originalData: DicomExtendedData, sopClass: string): DicomExtendedData {
    let result: DicomExtendedData = {};
    for (var moduleName in originalData) {
        if (moduleNameBelongsToSopClass(moduleName, sopClass)) {
            result[moduleName] = originalData[moduleName];
        }
    }
    return result;
}

/**
 * @description filters modules that do not belong to given Sop class
 * @param {DicomExtendedData} originalData data to filter
 * @param {string} sopClass clas to filter by
 * @returns {DicomExtendedData} filtered result data containing only modules 
 * that belong to given sop class
 */
export function filterRedundantCompareModulesBySopClass(
    originalData: DicomExtendedComparisonData,
    sopClass: string): DicomExtendedComparisonData {
    let result: DicomExtendedComparisonData = {};
    for (var moduleName in originalData) {
        if (moduleNameBelongsToSopClass(moduleName, sopClass)) {
            result[moduleName] = originalData[moduleName];
        }
    }
    return result;
}