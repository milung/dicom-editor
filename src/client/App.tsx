import * as React from 'react';
import AppBar from 'material-ui/AppBar';

import './App.css';
import { ApplicationStateReducer } from './application-state';
import { FileLoader } from './components/file-loader/file-loader';
import { DicomTable } from './components/dicom-table/dicom-table';
import { DicomEntry } from './model/dicom-entry';

let reducer = new ApplicationStateReducer();

interface AppState {
  dicomEntries: DicomEntry[];
}

export default class App extends React.Component<{}, AppState> {

  public constructor(props: {}) {
    super(props);
    this.state = {
      dicomEntries: []
    };
  }

  public componentDidMount() {
    reducer.state$.subscribe(_ => {this.setState({dicomEntries: _.dicomEntries});});
  }

  render() {
    return (
      <div className="app">
        <AppBar
          className="app-bar"
          title="Title"
        />
        <div className="app-view">
          {/*<SideBar />
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />*/}
          <div className="main-content">
            <FileLoader reducer={reducer}/>
            <DicomTable data={this.state.dicomEntries}/>
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
        </div>
      </div>
    );
  }
}