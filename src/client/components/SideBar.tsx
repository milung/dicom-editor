import * as React from 'react';

import Paper from 'material-ui/Paper';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import { Tabs, Tab } from 'material-ui/Tabs';

// import FontIcon from 'material-ui/FontIcon';
// icon={<FontIcon className="material-icons">restore</FontIcon>}

import './SideBar.css';
import { ApplicationStateReducer } from '../application-state';
import { HeavyweightFile, LightweightFile } from '../model/file-interfaces';

export interface SideBarProps {
    reducer: ApplicationStateReducer;
    // loadedFiles: File[],
    // recentFiles: File[]
}

export interface SideBarState {
    loadedFiles: HeavyweightFile[];
    recentFiles: LightweightFile[];
}

const SelectableList = makeSelectable(List);

export default class SideBar extends React.Component<SideBarProps, SideBarState> {

    public constructor(props: SideBarProps) {
        super(props);

        this.state = {
            loadedFiles: [],
            recentFiles: [],
        };

        this.selectCurrentFile = this.selectCurrentFile.bind(this);
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
                <Tabs>
                    <Tab
                        label="Loaded files"
                    >
                        <SelectableList>
                            {
                                this.state.loadedFiles.map((item, index) => (
                                    <ListItem
                                        onClick={() => this.selectCurrentFile(item)}
                                        key={index}
                                        value={item}
                                        primaryText={item.fileName}
                                    />
                                ))
                            }
                        </SelectableList>
                    </Tab>

                    <Tab
                        label="Recent files"
                    >
                        <SelectableList>
                            {
                                this.state.recentFiles.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        value={item}
                                        primaryText={item.fileName}
                                    />
                                ))
                            }
                        </SelectableList>
                    </Tab>
                </Tabs>

            </Paper>
        );
    }

    private selectCurrentFile(file: HeavyweightFile) {
        this.props.reducer.updateCurrentFile(file);
    }
}
