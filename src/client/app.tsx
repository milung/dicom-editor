import * as React from 'react';

import SideBar from './components/side-bar/side-bar';
import MainView from './containers/main-view';
import FileDropZone from './components/file-loader/file-drop-zone';

import './app.css';
import { ApplicationStateReducer } from './application-state';

import { RecentFileStoreUtil } from './utils/recent-file-store-util';
import { loadSavedFiles } from './utils/file-store-util';
import { Navigation } from './components/navigation/navigation';
import { ColorDictionary } from './utils/colour-dictionary';
import { loadLoadedFiles, loadComparisonActive, loadSelectedFiles } from './utils/loaded-files-store-util';

let reducer = new ApplicationStateReducer();
let fileStorage = new RecentFileStoreUtil(reducer);
fileStorage.loadRecentFiles();
loadSavedFiles(reducer);

let colorDictionary = new ColorDictionary();

loadLoadedFiles(reducer).then(() => {
      loadSelectedFiles(reducer, colorDictionary).then(() => {
        loadComparisonActive().then(result => {
          if (result === true) {
            reducer.setComparisonActive(true);
          }
          reducer.getState().selectedFiles.forEach(file => {
            colorDictionary.setColorAsUsed(file.colour);
          })
          // this.forceUpdate();
        });

      });
    });
  
interface AppState {
  open: boolean;
}

export default class App extends React.Component<{}, AppState> {

  public constructor(props: {}) {
    super(props);

    this.state = {
      open: false
    };
  }

  public componentDidMount() {
    // reducer.state$.subscribe(_ => {this.setState({dicomData: _.dicomData});});
  }

  render() {
    return (
      <div className="app">

        <Navigation reducer={reducer} />

        <FileDropZone reducer={reducer} >
          <div className="app-view">
            {/*<Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />*/}
            <div className="main-content">
              {/*<FileLoader reducer={reducer}/>
              <DicomTable data={this.state.dicomEntries}/>*/}
              <MainView reducer={reducer} />
              {/*<Switch>
                <Route exact path="/dashboard" render={() => (<Dashboard />)} />
                <Route exact path="/containers" render={() => (<ContainersPage />)} />
                <Route exact path="/containers/new" render={() => (<NewContainerPage />)} />
                <Route exact path="/containers/:Id" render={(props) => (<ContainerInspectPage {...props} />)} />
                <Route exact path="/images" render={() => (<ImagesPage />)} />
                <Route exact path="/networks" render={() => (<NetworksPage />)} />
                <Route exact path="/volumes" render={() => (<VolumesPage />)} />
              </Switch>*/}
            </div>
            <SideBar reducer={reducer} colorDictionary={colorDictionary} />
          </div>
        </FileDropZone>
      </div>
    );
  }
}