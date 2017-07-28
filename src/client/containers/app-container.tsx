import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route } from 'react-router-dom';
import App from '../app';
// import UI from '../ui';

export default class AppContainer extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <BrowserRouter>
            {/*<Route path="/" component={UI} />*/}
            <Route path="/" component={App} />
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    );
  }
}