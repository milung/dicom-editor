import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

interface HelloProps {
  name: string;
}

class Hello extends React.Component<HelloProps, {}> {
  render() {
    return <div>
      <h1>Hello, {this.props.name}</h1>
      <RaisedButton label="Default" />
    </div>;
  }
}

export default Hello;