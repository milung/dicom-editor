/**
 * Function tries to translate tag group number to its string name. If string name cannot
 * be found, its original tag group name is returned
 * @param tagGroup tag group name to be translated
 */
export function translateTagGroup(tagGroup: string): string {
    let translation = groupNameTranslation[tagGroup];
    if (translation === undefined) {
        return tagGroup;
    }
    return translation;
}

/**
 * List of all available translations for tag group numbers
 */
var groupNameTranslation = {
    '0008': 'EightName',
    '0007': 'SevenName',
    '0002': 'TwoName'
    // this data needs to be filled
};
