import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { ApplicationStateReducer } from '../../src/client/application-state';
import { JSDOM } from 'jsdom';
import { ColorDictionary } from "../../src/client/utils/colour-dictionary";
import LoadedFilesTab from "../../src/client/components/side-bar/loaded-files-tab";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
const doc = new JSDOM('<!doctype html><html><body></body></html>')
global.document = doc.window.document;
global.window = doc.window;
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

describe('LoadedFilesTab', () => {
  it('contains raised button', () => {
    let reducer = new ApplicationStateReducer();
    let props = prepareTestProps(reducer);

    const wrapper = mount(
      <MuiThemeProvider>
        <LoadedFilesTab
          reducer={props.reducer}
          loadedFiles={props.loadedFiles}
          selectedFiles={props.selectedFiles}
          colorDictionary={props.colorDictionary}
          className={props.className} />
      </MuiThemeProvider>
    );

    expect(wrapper.find('RaisedButton').length).to.equal(1);
  });
});

function prepareTestProps(reducer: ApplicationStateReducer) {
  return {
    reducer: reducer,
    loadedFiles: [],
    selectedFiles: [],
    colorDictionary: new ColorDictionary(),
    className: ''
  }
}