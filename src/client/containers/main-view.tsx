import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TagViewer from '../components/tag-viewer';
import ImageViewer from '../components/image-viewer';
import './main-view.css';
import { ApplicationStateReducer, SelectedFile } from '../application-state';
import { HeavyweightFile } from '../model/file-interfaces';
import { TableMode } from '../model/table-enum';

interface MainViewProps {
  reducer: ApplicationStateReducer;
}

interface MainViewState {
  currentFile: HeavyweightFile;
  loadedFiles: HeavyweightFile[];
  selectedFiles: SelectedFile[];
  tableMode: TableMode;
  actualBufferData: Uint8Array;
  comparisonActive: boolean;
}

export default class MainView extends React.Component<MainViewProps, MainViewState> {

  public constructor(props: MainViewProps) {
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
      loadedFiles: [],
      actualBufferData: new Uint8Array(0),
      tableMode: TableMode.SIMPLE,
      comparisonActive: false
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
        selectedFiles: state.selectedFiles ? state.selectedFiles : [],
        loadedFiles: state.loadedFiles ? state.loadedFiles : [],
        actualBufferData: state.currentFile ? state.currentFile.bufferedData : new Uint8Array(0),   
        comparisonActive: this.props.reducer.getState().comparisonActive 
      });
    });
  }

  render() {
    let fileNameArr=this.state.currentFile.fileName.split(".");
    return (
      <Tabs className="tabs" initialSelectedIndex={1}>
        <Tab
          label="Image viewer"
        >
          <div className="container">
            <h1>{fileNameArr[0]}</h1>
            <ImageViewer data={this.state.actualBufferData}/>
          </div>
        </Tab>
        <Tab
          label="Tags"
        >
          <div className="container">
            <h1>{fileNameArr[0]}</h1>
            <div id="simpleOrHierarchical">
              <Tabs>
                <Tab label="Simple" onClick={() => this.setState({tableMode: TableMode.SIMPLE})}/>
                <Tab label="Hierarchical" onClick={() => this.setState({tableMode: TableMode.EXTENDED})}/>
              </Tabs>
            </div>
          </div>

          <div className="container">
            <TagViewer 
                files={this.state.selectedFiles} 
                tableMode={this.state.tableMode} 
                currentFile={this.state.currentFile}
                comparisonActive={this.state.comparisonActive} 
            />
          </div>
        </Tab>
      </Tabs>
    );
  }
}