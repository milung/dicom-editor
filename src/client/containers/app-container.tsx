import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { BrowserRouter, Route } from 'react-router-dom';
import App from '../app';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#009999',
    borderColor: '#009e9e'
  },

  tabs: {
    backgroundColor: '#daeded',
    textColor: '#009999',
    selectedTextColor: '#016d6d',
  },

  inkBar: {
    backgroundColor: '#009999'
  }
});

export default class AppContainer extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
          <BrowserRouter>
            {/*<Route path="/" component={UI} />*/}
            <Route path="/" component={App} />
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    );
  }
}