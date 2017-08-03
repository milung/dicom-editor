import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MuiThemeProvider } from 'material-ui/styles';
import RecentFilesTab from '../../src/client/components/side-bar/recent-files-tab';
import { ApplicationStateReducer } from '../../src/client/application-state';
import { ColorDictionary } from '../../src/client/utils/colour-dictionary';
import { LightweightFile } from '../../src/client/model/file-interfaces';

describe('recent-files-tab', () => {
    it('should render recent files tab with two files', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        let dict: ColorDictionary = new ColorDictionary();

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

        let element = mount(
            <MuiThemeProvider>
                <RecentFilesTab 
                    reducer={reducer}
                    recentFiles={files}
                    colorDictionary={dict}
                />
            </MuiThemeProvider>
        )

        expect(element.find('List').length).to.equal(1);
        expect(element.find('ListItem').length).to.equal(2);
        element.find('ListItem').map((item, index) => {
            expect(item.props()).to.have.property('primaryText', files[index].fileName);
        })
    });
});