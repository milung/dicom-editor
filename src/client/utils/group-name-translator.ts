
export function translateTagGroup(tagGroup: string): string {
    let translation = groupNameTranslation[tagGroup];
    if (translation === undefined) {
        return tagGroup;
    }
    return translation;
}

var groupNameTranslation = {
    '0008': 'EightName',
    '0007': 'SevenName'
}
