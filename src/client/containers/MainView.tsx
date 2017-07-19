import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TagViewer from '../components/TagViewer';
import ImageViewer from '../components/ImageViewer';

import './MainView.css';


export default class MainView extends React.Component<{}, {}> {
  render() {
    return (
      <Tabs className="tabs">
        <Tab
          label="Image viewer"
        >
          <ImageViewer />

        </Tab>

        <Tab
          label="Tags"
        >
          <TagViewer />
        </Tab>
      </Tabs>
    );
  }
}