import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TagViewer from '../components/tag-viewer';
import ImageViewer from '../components/image-viewer';

import './main-view.css';
import { ApplicationStateReducer } from '../application-state';
import { DicomSimpleData } from '../model/dicom-entry';
import { convertSimpleDicomToExtended } from '../utils/dicom-entry-converter';

interface MainViewProps {
  reducer: ApplicationStateReducer;
}

interface MainViewState {
  dicomData: DicomSimpleData;
}

export default class MainView extends React.Component<MainViewProps, MainViewState> {

  public constructor(props: MainViewProps) {
    super(props);
    this.state = {
      dicomData: {
        entries: []
      }
    };
  }

  public componentDidMount() {
    this.props.reducer.state$.subscribe(state => {
      this.setState({
        dicomData: state.currentFile ? state.currentFile.dicomData : { entries: []}
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
            <ImageViewer/>
          </div>
        </Tab>

        <Tab
          label="Tags"
        >
          <div className="container">
            <TagViewer data={convertSimpleDicomToExtended(this.state.dicomData)} />
          </div>
        </Tab>
      </Tabs>
    );
  }
}