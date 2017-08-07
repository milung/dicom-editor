/**
 * List of all available sop class and their corresponding modules
 */
const sopClassModules = {
    'TEST SOP CLASS': [
        'TEST MODULE 1',
        'TEST MODULE 2'
    ]
};

export const NOT_FOUND_SOP = 'Undefined SOP class';

/**
 * Function tries to get module names for given SOP class. If SOP class cannot
 * be found, 'Undefined SOP class' is returned. Else array of module names is returned
 * @param sopClass sopClass to get module names for
 */
export function getModuleNamesForSopClass(sopClass: string): string[] {
    let translation = sopClassModules[sopClass];
    if (translation === undefined) {
        return [NOT_FOUND_SOP];
    }
    return translation;
}

/**
 * @description Checks if given module name belongs to given sop class
 * @param {string} moduleName module name to check
 * @param {string} sopClass sop class to check
 * @returns {boolean} TRUE if given module name belongs to given sop class, FALSE otherwise
 */
export function moduleNameBelongsToSopClass(moduleName: string, sopClass: string): boolean {
    return getModuleNamesForSopClass(sopClass).indexOf(moduleName) > -1;
}