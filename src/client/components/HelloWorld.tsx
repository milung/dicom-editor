import * as React from 'react';
import './HelloWorld.css';
import RaisedButton from 'material-ui/RaisedButton';

interface HelloProps {
  name: string;
}

class Hello extends React.Component<HelloProps, {}> {
  render() {
    return (
      <div>
        <h1 className="redh1">Hello, {this.props.name}</h1>
        <RaisedButton label="Default" />
      </div>
    );
  }
}

export default Hello;