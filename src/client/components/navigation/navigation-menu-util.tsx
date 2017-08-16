import { ApplicationState } from '../../application-state';

const SINGLE_FILE_SAVE_TEXT = 'Save file';
const SINGLE_FILE_EXPORT_TEXT = 'Export file';
const SINGLE_FILES_UNLOAD_TEXT = 'Unload file';
const MULTI_FILES_SAVE_TEXT = 'Save selected files';
const MULTI_FILES_EXPORT_TEXT = 'Export selected files';
const MULTI_FILES_UNLOAD_TEXT = 'Unload selected files';

export interface ApplicationMenuItem {
    text: string;
    disabled: boolean;
}

export interface ApplicationMenu {
    exportItem: ApplicationMenuItem;
    saveItem: ApplicationMenuItem;
    unloadItem: ApplicationMenuItem;
    compareItem: ApplicationMenuItem;
}

/**
 * @description Util takes care of right texts on menu items
 */
export class NavigationMenuUtil {
    public constructor(private appState: ApplicationState) {

    }

    /**
     * @description generates correct texts of menu items and if items are disabled / enabled
     * @returns {ApplicationMenu} application menu that corresponds with given application state
     */
    public getActualMenu(): ApplicationMenu {
        let filesCount = this.appState.selectedFiles.length;
        let result: ApplicationMenu = {
            exportItem: { text: '', disabled: false },
            saveItem: { text: '', disabled: false },
            unloadItem: { text: '', disabled: false },
            compareItem: { text: 'Compare selected files', disabled: true }
        };
        // if there are no selected files, we take current file so count is 1
        if (!filesCount && this.appState.currentFile) {
            filesCount = 1;
        }

        if (filesCount === 2) {
            result.compareItem.disabled = false;
        }

        if (filesCount > 1) {
            result.exportItem.text = MULTI_FILES_EXPORT_TEXT;
            result.saveItem.text = MULTI_FILES_SAVE_TEXT;
            result.unloadItem.text = MULTI_FILES_UNLOAD_TEXT;
        } else {
            result.exportItem.text = SINGLE_FILE_EXPORT_TEXT;
            result.saveItem.text = SINGLE_FILE_SAVE_TEXT;
            result.unloadItem.text = SINGLE_FILES_UNLOAD_TEXT;
            if (filesCount === 0) {
                result.exportItem.disabled = true;
                result.saveItem.disabled = true;
                result.unloadItem.disabled = true;
            }
        }

        return result;
    }
}