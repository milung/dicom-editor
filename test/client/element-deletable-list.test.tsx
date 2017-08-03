import * as React from 'react';
import { mount } from 'enzyme';
import { ApplicationStateReducer } from "../../src/client/application-state";
import { LightweightFile } from "../../src/client/model/file-interfaces";
import { expect } from 'chai';
import { MuiThemeProvider } from "material-ui/styles";
import { ElementOfDeletableList } from "../../src/client/components/side-bar/element-deletable-list";

describe('ElementOfDeletableList', () => {
    it('should render element', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        let file: LightweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            dbKey: 'name',
        }

        let element = mount(
            <MuiThemeProvider>
                <ElementOfDeletableList
                    lightFile={file}
                    showPopUpFunction={() => {}}
                    reducer={reducer}
                />
            </MuiThemeProvider>

        );

        expect(element.find('ListItem').length).to.equal(1);
    });
});