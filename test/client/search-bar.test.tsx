import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SearchBar from '../../src/client/components/search-bar';
import { ApplicationStateReducer } from '../../src/client/application-state';

describe('search-bar', () => {
    it('should render search bar', () => {
        let reducer = new ApplicationStateReducer();
        const searchbar = shallow(<SearchBar reducer={reducer} />);
        expect(searchbar.find('div').find('div').find('TextField').length).to.equal(1);
    });
    
    it('should render search bar with second div containing clear icon', () => {
        let reducer = new ApplicationStateReducer();
        const searchbar = shallow(<SearchBar reducer={reducer} />);
        expect(searchbar.find('div').find('div').find('ClearIcon')[1]);
    });

    it('should render search bar with first div containing button', () => {
        let reducer = new ApplicationStateReducer();
        const searchbar = shallow(<SearchBar reducer={reducer} />);
        expect(searchbar.find('div').find('RaisedButton').length).to.equal(1);
    });
});