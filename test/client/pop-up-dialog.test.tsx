import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MuiThemeProvider } from 'material-ui/styles';
import { ApplicationStateReducer } from '../../src/client/application-state';
import { LightweightFile } from '../../src/client/model/file-interfaces';
import { DeletePopUpDialog } from '../../src/client/components/side-bar/delete-popup-dialog';

describe('delete-pop-up-dialog', () => {
     it('should render element', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        let openedDeleteDialog: boolean = false;
        let file : LightweightFile = {
            fileName: 'name',
            timestamp: 1,
            dbKey: 'name' 
        }
        let element = mount(
            <MuiThemeProvider>
                <DeletePopUpDialog
                    reducer={reducer}
                    openedDeleteDialog={openedDeleteDialog}
                    fileInPopUp={file}
                    handleCloseDeleteDialog={()=>{}}
                />
            </MuiThemeProvider>

        );

        expect(element.find('PopUpDialog').length).to.equal(1);
    });
});