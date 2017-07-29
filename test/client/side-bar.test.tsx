import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SideBar from '../../src/client/components/side-bar/side-bar';
import { ApplicationStateReducer } from '../../src/client/application-state';

describe('dicom-table', () => {
    it('should render side bar with 3 tabs', () => {
        let reducer = new ApplicationStateReducer();
        const sideBar = shallow(<SideBar reducer={reducer} />);
        expect(sideBar.find('Paper').find('Tabs').find('Tab').length).to.equal(3);
    });

    it('should render side bar with first tab containing button', () => {
        let reducer = new ApplicationStateReducer();
        const sideBar = shallow(<SideBar reducer={reducer} />);
        expect(sideBar.find('Paper').find('Tabs').childAt(0).find('RaisedButton').length).to.equal(1);
    });

    it('should render side bar with third tab containing button', () => {
        let reducer = new ApplicationStateReducer();
        const sideBar = shallow(<SideBar reducer={reducer} />);
        expect(sideBar.find('Paper').find('Tabs').childAt(2).find('RaisedButton').length).to.equal(1);
    });

    it('should render all tabs with List component', () => {
        let reducer = new ApplicationStateReducer();
        const sideBar = shallow(<SideBar reducer={reducer} />);
        let allHave = true;
        sideBar.find('Paper').find('Tabs').children('Tab').map((el, index) => {
            allHave = allHave && el.find('List').length === 1;
        });
        expect(allHave).to.equal(true);
    });
});