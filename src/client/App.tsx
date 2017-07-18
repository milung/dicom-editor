import * as React from 'react';
import AppBar from 'material-ui/AppBar';

import './App.css';
import { ApplicationStateReducer } from "./application-state";
import { FileLoader } from "./components/file-loader/file-loader";

let reducer = new ApplicationStateReducer();

export default class App extends React.Component<{}, {}> {
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