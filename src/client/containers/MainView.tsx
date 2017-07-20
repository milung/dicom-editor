import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TagViewer from '../components/TagViewer';
import ImageViewer from '../components/ImageViewer';

import './MainView.css';
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
      <Tabs className="tabs">
        <Tab
          label="Image viewer"
        >
          <ImageViewer/>

        </Tab>

        <Tab
          label="Tags"
        >
          <TagViewer data={this.state.dicomData} />
        </Tab>
      </Tabs>
    );
  }
}