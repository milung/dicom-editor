import * as React from 'react';
import { PopUpDialog } from './pop-up-dialog';
import { ApplicationStateReducer } from '../../application-state';
import { deleteFileFromSaved, loadSavedFiles } from '../../utils/file-store-util';
import { LightweightFile } from '../../model/file-interfaces';
import { RecentFileStoreUtil } from '../../utils/recent-file-store-util';

interface DeletePopUpDialogProps {
    reducer: ApplicationStateReducer;
    handleCloseDeleteDialog: Function;
    openedDeleteDialog: boolean;
    fileInPopUp?: LightweightFile;
}

interface DeletePopUpDialogState {
}

export default class DeletePopUpDialog extends React.Component<DeletePopUpDialogProps, DeletePopUpDialogState> {
    constructor(props: DeletePopUpDialogProps) {
        super(props);

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.findIndexOfFile = this.findIndexOfFile.bind(this);
    }

    render() {
        return (
            <PopUpDialog
                handleClosePopUpDialog={this.props.handleCloseDeleteDialog}
                handleAction={this.handleDeleteClick}
                openedPopUpDialog={this.props.openedDeleteDialog}
                popUpConfirmText="Delete the file"
                popUpText="Are you sure you want to delete the file?"
            />
        );
    }
    public handleDeleteClick() {
        if (this.props.fileInPopUp) {
            let file = this.props.fileInPopUp;
            deleteFileFromSaved(this.props.fileInPopUp);
            loadSavedFiles(this.props.reducer);

            // delete from recent files
            let index = this.findIndexOfFile(file.dbKey, this.props.reducer.getState().recentFiles);

            // if is in recent files, remove from DB and app state
            if (index > -1) {
                let recentFileStore: RecentFileStoreUtil = new RecentFileStoreUtil(this.props.reducer);
                recentFileStore.deleteFileFromRecent(file);
                this.props.reducer.removeRecentFile(index);
            }

            this.props.handleCloseDeleteDialog();
        }
    }

    /**
     * @description Finds index of file in given array based on db key
     * @param {string} searchDbKey db key of file, for which index should be found
     * @param {LightweightFile[]} files array of files to search in
     * @returns {number} index of file found by db key or -1 if no file found
     */
    private findIndexOfFile(searchDbKey: string, files: LightweightFile[]): number {
        let i: number = -1;
        files.map((element, index) => {
            if (element.dbKey === searchDbKey) {
                i = index;
            }
        });

        return i;
    }
}