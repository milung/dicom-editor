import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TagViewer from '../components/tag-viewer';
import ImageViewer from '../components/image-viewer';
import './main-view.css';
import { ApplicationStateReducer } from '../application-state';
import { DicomSimpleData } from '../model/dicom-entry';

export const TABLE_MODE_EXTENDED = 'extended';
export const TABLE_MODE_SIMPLE = 'simple';

interface MainViewProps {
  reducer: ApplicationStateReducer;
}

interface MainViewState {
  dicomData: DicomSimpleData;
  tableMode: string;
}

export default class MainView extends React.Component<MainViewProps, MainViewState> {

  public constructor(props: MainViewProps) {
    super(props);
    this.state = {
      dicomData: {
        entries: []
      },
      tableMode: TABLE_MODE_SIMPLE
    };
  }

  public componentDidMount() {
    this.props.reducer.state$.subscribe(state => {
      this.setState({
        dicomData: state.currentFile ? state.currentFile.dicomData : { entries: [] }
      });
    });
  }

  render() {
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
                <Tab label="Simple" onClick={() => this.setState({tableMode: TABLE_MODE_SIMPLE})}></Tab>
                <Tab label="Hierarchical" onClick={() => this.setState({tableMode: TABLE_MODE_EXTENDED})}></Tab>
              </Tabs>
            </div>
          </div>

          <div className="container">
            <TagViewer
              data={(this.state.dicomData)}
              tableMode={this.state.tableMode} />
          </div>
        </Tab>
      </Tabs>
    );
  }
}