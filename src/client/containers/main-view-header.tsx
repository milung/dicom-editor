import * as React from 'react';
import './main-view.css';
import { ApplicationStateReducer } from '../application-state';
import { HeavyweightFile, SelectedFile } from '../model/file-interfaces';

interface MainViewHeaderProps {
    reducer: ApplicationStateReducer;
}

interface MainViewHeaderState {
    currentFile: HeavyweightFile;
    selectedFiles: SelectedFile[];
    fileNameOne: string;
    fileNameTwo: string;
    header: string;
    headerJoin: string;
    searching: string;
}

export default class MainViewHeader extends React.Component<MainViewHeaderProps, MainViewHeaderState> {

    public constructor(props: MainViewHeaderProps) {
        super(props);
        this.state = {
            currentFile: {
                fileSize: 0,
                bufferedData: new Uint8Array(0),
                dicomData: { entries: [] },
                fileName: '',
                timestamp: 0
            },
            selectedFiles: [],
            fileNameOne: '',
            fileNameTwo: '',
            header: '',
            headerJoin: '',
            searching: ''
        };
    }

    public componentDidMount() {
        this.props.reducer.state$.subscribe(state => {
            this.setState({
                currentFile: state.currentFile ? state.currentFile :
                    {
                        fileSize: 0,
                        bufferedData: new Uint8Array(0),
                        dicomData: { entries: [] },
                        fileName: '',
                        timestamp: 0
                    },
                fileNameOne: state.selectedFiles[0] && state.comparisonActive ?
                    state.selectedFiles[0].selectedFile.fileName : '',
                fileNameTwo: state.selectedFiles[1] && state.comparisonActive ?
                    state.selectedFiles[1].selectedFile.fileName : '',
                header: state.comparisonActive ? (state.searchExpression ? 'Searching in ' : 'Compare ') :
                    (state.currentFile ? (state.searchExpression ?
                        (state.comparisonActive ? '' : ('Searching in ' + state.currentFile.fileName.split('.')[0])) :
                        (state.currentFile.fileName.split('.')[0])) : 'Tag viewer'),
                headerJoin: state.comparisonActive ? ' and ' : ''
            });
        });
    }

    render() {
        return (
            <h1 className="file-name-h1">{this.state.header + this.state.fileNameOne.split('.')[0] +
                this.state.headerJoin + this.state.fileNameTwo.split('.')[0]}</h1>
        );
    }
}