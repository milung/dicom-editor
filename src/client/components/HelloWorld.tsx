import * as React from 'react';
import './HelloWorld.css';
import RaisedButton from 'material-ui/RaisedButton';
import Files from 'react-files';

interface HelloProps {
  name: string;
}

class Hello extends React.Component<HelloProps, {}> {
  render() {
    return <div>
      <h1 className='redh1'>Hello, {this.props.name}</h1>
      <RaisedButton label="Default" />
      <div className="files">
        <Files
          className='files-dropzone'
          multiple
          maxFiles={3}
          maxFileSize={10000000}
          minFileSize={0}
          clickable
        >
          Drop files here or click to upload
        </Files>
      </div>
    </div>;
  }
}

export default Hello;