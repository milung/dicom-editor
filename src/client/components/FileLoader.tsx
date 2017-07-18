import * as React from "react";
import { FileConverter } from "../FileConverter";
import Files from 'react-files';

export class FileLoader extends React.Component<{}, {}> {

    constructor(props: {}, context: {}) {
        super();

    }

    onFilesChange (files: File[]) {
        console.log(files);
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(files[0]);
        console.log(fileReader.result);

        let fc = new FileConverter(files[0]);
        fc;
 
    };

    onFilesError (files: File[]) {
        console.log('Error ');
 
    };

    render() {
        return (
        <div className="files">
         <Files
           className='files-dropzone'
           onChange={this.onFilesChange}
           onError={this.onFilesError}
           multiple
           maxFiles={3}
           maxFileSize={1000000000000000000000}
           minFileSize={0}
           clickable
         >
           Drop files here or click to upload
       </Files>
       </div>
        );
    }
}

export default FileLoader;
