import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TagViewer from '../components/tag-viewer';
import ImageViewer from '../components/image-viewer';

import './main-view.css';
import { ApplicationStateReducer } from '../application-state';
import { DicomData } from '../model/dicom-entry';

interface MainViewProps {
  reducer: ApplicationStateReducer;
}

interface MainViewState {
  dicomData: DicomData;
}

export default class MainView extends React.Component<MainViewProps, MainViewState> {

  public constructor(props: MainViewProps) {
    super(props);
    this.state = {
      dicomData: {}
    };
  }

  public componentDidMount() {
    this.props.reducer.state$.subscribe(state => {
      this.setState({
        dicomData: state.currentFile ? state.currentFile.dicomData : {}
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
            <TagViewer data={this.state.dicomData} />
          </div>
        </Tab>
      </Tabs>
    );
  }
}