import * as React from 'react';
import { mount } from 'enzyme';
import { ElementOfSelectableList } from '../../src/client/components/side-bar/element-selectable-list';
import { ApplicationStateReducer } from "../../src/client/application-state";
import { ColorDictionary } from "../../src/client/utils/colour-dictionary";
import { HeavyweightFile } from "../../src/client/model/file-interfaces";
import { expect } from 'chai';
import { MuiThemeProvider } from "material-ui/styles";

describe('ElementOfSelectableList', () => {
    it('should render element', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        let dict = new ColorDictionary();
        let file: HeavyweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            fileSize: 1,
            bufferedData: new Uint8Array(0),
            dicomData: {
                entries: []
            }
        }

        let element = mount(
            <MuiThemeProvider>
                <ElementOfSelectableList
                    reducer={reducer}
                    item={file}
                    selectFunction={() => { }}
                    colorDictionary={dict}
                    checked={false}
                    color={'red'}
                    checkInform={() => { }}
                />
            </MuiThemeProvider>

        );

        expect(element.find('Checkbox').length).to.equal(1);
        expect(element.find('ListItem').length).to.equal(1);
        expect(element.find('.clearIcon').length).to.equal(1);
    });
});