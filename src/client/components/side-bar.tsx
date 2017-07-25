import * as React from 'react';

import Paper from 'material-ui/Paper';
import { List } from 'material-ui/List';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';

import { ApplicationStateReducer } from '../application-state';
import { HeavyweightFile, LightweightFile } from '../model/file-interfaces';
import { ElementOfSelectableList } from './element-selectable-list';
import './side-bar.css';
import { ListItem } from "material-ui";
import TabTemplate from './tab-template';

export interface SideBarProps {
    reducer: ApplicationStateReducer;
}

export interface SideBarState {
    loadedFiles: HeavyweightFile[];
    recentFiles: LightweightFile[];
}

export default class SideBar extends React.Component<SideBarProps, SideBarState> {

    public constructor(props: SideBarProps) {
        super(props);

        this.state = {
            loadedFiles: [],
            recentFiles: [],
        };

        this.selectCurrentFile = this.selectCurrentFile.bind(this);
        this.selectCurrentFileFromRecentFile = this.selectCurrentFileFromRecentFile.bind(this);
    }

    public componentDidMount() {
        this.props.reducer.state$.subscribe(state => {
            this.setState({
                loadedFiles: state.loadedFiles, recentFiles: state.recentFiles
            });
        });
    }

    render() {
        return (
            <Paper className="side-bar">
                <Tabs
                    className="tabs-container"
                    contentContainerClassName="content-tab"
                    tabItemContainerStyle={{ display: 'block' }}
                    tabTemplate={TabTemplate}
                    tabTemplateStyle={{display: 'flex', flexDirection: 'column', flexGrow: 1}}
                >
                    <Tab label="Loaded files">
                        {/*<div className="scrollable-y">*/}
                            <List style={{overflowX: 'hidden', overflowY: 'auto'}}>
                                {this.state.loadedFiles.map((item, index) => (
                                    <ElementOfSelectableList
                                        key={index}
                                        item={item}
                                        selectFunction={this.selectCurrentFile}
                                    />
                                ))}
                            </List>
                        
                            <RaisedButton
                                className="compare-button"
                                label="Compare files"
                                onClick={this.test}
                                primary={true}
                            />
                        {/*</div>*/}
                    </Tab>
                    <Tab label="Recent files">
                        <List>
                            {this.state.recentFiles.map((item, index) => (
                                <ListItem
                                    onClick={() => this.selectCurrentFileFromRecentFile(item)}
                                    primaryText={item.fileName}
                                />
                            ))}
                        </List>
                    </Tab>
                </Tabs>
            </Paper>
        );
    }

    // remove when file comparator will be implemented and change onCLick on raised button
    public test() {
        process.stdout.write('TEST');
    }

    private selectCurrentFile(file: HeavyweightFile) {
        this.props.reducer.updateCurrentFile(file);
    }

    private selectCurrentFileFromRecentFile(file: LightweightFile) {
        this.props.reducer.updateCurrentFromRecentFile(file);
    }
}
