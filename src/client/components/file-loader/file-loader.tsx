import * as React from 'react';
import Files from 'react-files';
import { ApplicationStateReducer } from "../../application-state";

interface FileLoaderProps {
    reducer: ApplicationStateReducer;
}

interface FileLoaderStats {
    name: string;
}

export class FileLoader extends React.Component<FileLoaderProps, FileLoaderStats> {

    public constructor(props: FileLoaderProps) {
        super(props);
        this.onFilesChange = this.onFilesChange.bind(this);

        this.state = {
            name: 'def name'
        }
    }

    public componentDidMount() {
        //  this.props.reducer.state$.subscribe(_ => {this.setState({name: _.name})});
    }

    public render() {
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
                    Click to select file or drag & drop
       </Files>
            </div>
        );
    }

    private onFilesChange(files: File[]) {
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(files[0]);

        this.props.reducer.handleInputFile(files[0]);

    };

    private onFilesError(files: File[]) {
        console.log('Error ');
    };
}

export default FileLoader;
