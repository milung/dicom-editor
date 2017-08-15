import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MuiThemeProvider } from 'material-ui/styles';
import { Navigation } from '../../src/client/components/navigation/navigation';
import { ApplicationStateReducer } from "../../src/client/application-state";


describe('navigation', () => {
    it('should render navigation with drawer and app bar', () => {
        let reducer = new ApplicationStateReducer();
        let element = mount(
            <MuiThemeProvider>
                <Navigation reducer={reducer} />
            </MuiThemeProvider>
        )

        expect(element.find('Drawer').length).to.equal(1);
        expect(element.find('AppBar').length).to.equal(1);

    });

    it('should render navigation in drawer with "Export" and "Save to browser" menu item', () => {
        let reducer = new ApplicationStateReducer();
        let element = mount(
            <MuiThemeProvider>
                <Navigation reducer={reducer} />
            </MuiThemeProvider>
        )

        expect(element.find('Drawer').find('MenuItem').length).to.equal(2);
        element.find('Drawer').find('MenuItem').map((item, index) => {
            switch (index) {
                case 0: {
                    expect(item.props()).to.have.property('primaryText', 'Export');
                    break;
                }
                case 1: {
                    expect(item.props()).to.have.property('primaryText', 'Save here');
                    break;
                }
            }
        })

    });
});