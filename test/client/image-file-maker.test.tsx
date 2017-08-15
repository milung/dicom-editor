import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

const doc = new JSDOM('<!doctype html><html><body></body></html>')
global.document = doc.window.document;
global.window = doc.window;
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

import { getImageFile } from '../../src/client/utils/image-file-maker';

describe('image-file-maker', () => {
    it('get null when no image is present', () => {
        shallow(<div></div>);
        let result = getImageFile();
        expect(result).to.be.null;
    });
});