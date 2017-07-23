/**
 * List of all available module names for tags
 */
const moduleNameTranslation = {
    '00080012': ['EightModule', 'ExtendedEightModule'],
    '00070016': ['SevenModule'],
    '00120012': ['TwelveModule', 'ExtendedEightModule'],
    // this data needs to be filled
};

/**
 * Function tries to get module names for tag. If module name cannot
 * be found, 'Undefined module group' is returned. Else array of module names is returned
 * @param tag tag to get module name for
 */
export function getModuleNamesForTag(tag: string): string[] {
    let translation = moduleNameTranslation[tag];
    if (translation === undefined) {
        return ['Undefined module group'];
    }
    return translation;
}
