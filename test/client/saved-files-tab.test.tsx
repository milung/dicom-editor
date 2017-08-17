import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MuiThemeProvider } from 'material-ui/styles';
import { ApplicationStateReducer } from '../../src/client/application-state';
import { LightweightFile } from '../../src/client/model/file-interfaces';
import SavedFilesTab from '../../src/client/components/side-bar/saved-files-tab';
import { ColorDictionary } from "../../src/client/utils/colour-dictionary";

describe('saved-files-tab', () => {
    it('should render two basic listItems in saved files tab', () => {
        let element = mount(prepareSavedFileTab([]));
        expect(element.find('ListItem').length).to.equal(2);
    });

    it('should render empty recent files', () => {
        let element = mount(prepareSavedFileTab([]));
        expect(element.find('List').first().find('ListItem').first().prop('nestedItems')).to.deep.equal([]);
    });

    it('should render saved files tab with two files', () => {
        let files: LightweightFile[] = [
            {
                fileName: 'name',
                timestamp: 123456789,
                dbKey: 'name',
            },
            {
                fileName: 'name2',
                timestamp: 2,
                dbKey: 'name2',
            }
        ];

        let element = mount(prepareSavedFileTab(files));
        expect(element.find('ElementOfDeletableList').length).to.equal(2);
        element.find('ElementOfDeletableList').map((item, index) => {
            expect(item.props()).to.have.property('lightFile', files[index]);
        });
    });
});

function prepareSavedFileTab(files: LightweightFile[]): JSX.Element {
    let reducer: ApplicationStateReducer = new ApplicationStateReducer();
    let colorDictionary = new ColorDictionary();

    return (
        <MuiThemeProvider>
            <SavedFilesTab
                reducer={reducer}
                savedFiles={files}
                showPopUpOverrideConfirmation={() => { }}
                showPopUpDeleteConfirmation={() => { }}
                saveFile={() => { }}
                className={''}
                recentFiles={files}
                colorDictionary={colorDictionary}
            />
        </MuiThemeProvider>
    );
}