import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TagViewer from '../components/tag-viewer';
import ImageViewer from '../components/image-viewer';
import './main-view.css';
import { ApplicationStateReducer, SelectedFile } from '../application-state';
import { DicomSimpleData } from '../model/dicom-entry';
import { HeavyweightFile } from "../model/file-interfaces";
import { TableMode } from "../model/table-enum";

interface MainViewProps {
  reducer: ApplicationStateReducer;
}

interface MainViewState {
  dicomData: DicomSimpleData;
  loadedFiles: HeavyweightFile[];
  selectedFiles: SelectedFile[];
  tableMode: TableMode;
}

export default class MainView extends React.Component<MainViewProps, MainViewState> {

  public constructor(props: MainViewProps) {
    super(props);
    this.state = {
      dicomData: {
        entries: [],
        
      },
      selectedFiles: [],
      loadedFiles: [],
      tableMode: TableMode.SIMPLE
    };
  }

  public componentDidMount() {
    this.props.reducer.state$.subscribe(state => {
      this.setState({
        dicomData: state.currentFile ? state.currentFile.dicomData : { entries: []},
        selectedFiles: state.selectedFiles ? state.selectedFiles : [],
        loadedFiles: state.loadedFiles ? state.loadedFiles : []
      });
    });
  }

  render() {
    let files: HeavyweightFile[] = [];
    this.state.selectedFiles.forEach(selectedFile => {
      files.push(this.state.loadedFiles[selectedFile.fileIndex])
    })

    return (
      <Tabs className="tabs" initialSelectedIndex={1}>
        <Tab
          label="Image viewer"
        >
          <div className="container">
            <ImageViewer />
          </div>
        </Tab>
        <Tab
          label="Tags"
        >
          <div>
            <div id="simpleOrHierarchical">
              <Tabs>
                <Tab label="Simple" onClick={() => this.setState({tableMode: TableMode.SIMPLE})}></Tab>
                <Tab label="Hierarchical" onClick={() => this.setState({tableMode: TableMode.EXTENDED})}></Tab>
              </Tabs>
            </div>
          </div>

          <div className="container">
            <TagViewer files = {files} tableType = {this.state.tableMode} />
          </div>
        </Tab>
      </Tabs>
    );
  }
}