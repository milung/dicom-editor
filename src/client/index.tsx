import * as React from "react";
import * as ReactDOM from "react-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Hello from "./HelloWorld";

const App = () => (
  <MuiThemeProvider>
    <Hello name="Test2" />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
