import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { ApplicationStateReducer } from '../../src/client/application-state';
import LoadedFilesTab from '../../src/client/components/side-bar/loaded-files-tab';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { prepareDefaultTestProps, prepareTestFile } from "./test-utils";

injectTapEventPlugin();
const doc = new JSDOM('<!doctype html><html><body></body></html>')
global.document = doc.window.document;
global.window = doc.window;
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

describe('LoadedFilesTab', () => {
  it('contains raised button', () => {
    let reducer = new ApplicationStateReducer();
    let props = prepareDefaultTestProps(reducer);

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

  it('list item contains correct number of items', () => {
    let reducer = new ApplicationStateReducer();
    let props = prepareDefaultTestProps(reducer);

    const wrapper = mount(
      <MuiThemeProvider>
        <LoadedFilesTab
          reducer={props.reducer}
          loadedFiles={[prepareTestFile(), prepareTestFile()]}
          selectedFiles={props.selectedFiles}
          colorDictionary={props.colorDictionary}
          className={props.className} />
      </MuiThemeProvider>
    );

    expect(wrapper.find('ElementOfSelectableList').length).to.equal(2);
  });

  // it('first two checked items should have a color', ()=>{
  //     let reducer = new ApplicationStateReducer();
  //     let props = prepareDefaultTestProps(reducer);

  //     const wrapper = mount(
  //       <MuiThemeProvider>
  //         <LoadedFilesTab
  //           reducer={props.reducer}
  //           loadedFiles={[prepareTestFile(), prepareTestFile()]}
  //           selectedFiles={props.selectedFiles}
  //           colorDictionary={props.colorDictionary}
  //           className={props.className} 
  //         />
  //       </MuiThemeProvider>
  //     );

  //     expect(wrapper.find('ElementOfSelectableList').first).to.have.props(color: 'black');
  // });
});
