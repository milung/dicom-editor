import * as React from 'react';
import { shallow } from 'enzyme';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiEnzyme from 'chai-enzyme';
// import * as sinon from 'sinon';

import HelloWorld from '../../src/client/components/HelloWorld';

chai.use(chaiEnzyme());

// const clickSpy = sinon.spy();

const container = shallow(<HelloWorld name="Test2" />);

describe("Sample test client", () => {
    it('renders without crashing', () => {
        expect(container.find('h1').length).to.equal(1);
    });

    it('should contain the text passed as props', () => {
        expect(container.find('h1').text()).to.equal('Hello, Test2');
    });
});
