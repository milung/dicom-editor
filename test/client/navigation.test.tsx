import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MuiThemeProvider } from 'material-ui/styles';
import { Navigation } from '../../src/client/components/navigation/navigation';

describe('navigation', () => {
    it('should render navigation with drawer and app bar', () => {
        let element = mount(
            <MuiThemeProvider>
                <Navigation />
            </MuiThemeProvider>
        )

        expect(element.find('Drawer').length).to.equal(1);
        expect(element.find('AppBar').length).to.equal(1);

    });

    it('should render navigation in drawer with "Export" menu item', () => {
        let element = mount(
            <MuiThemeProvider>
                <Navigation />
            </MuiThemeProvider>
        )

        expect(element.find('Drawer').find('MenuItem').length).to.equal(1);
        element.find('MenuItem').map((item, index) => {
            switch (index) {
                case 0: {
                    expect(item.props()).to.have.property('primaryText', 'Export');
                }
            }

        })

    });
});