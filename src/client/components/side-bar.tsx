import * as React from 'react';
import { Tabs, Tab, RaisedButton, List, makeSelectable, Paper } from 'material-ui';
import { ApplicationStateReducer } from '../application-state';
import { HeavyweightFile, LightweightFile } from '../model/file-interfaces';
import { ElementOfSelectableList } from './element-selectable-list';
import './side-bar.css';
import './compare-button.css';

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
                <Tabs>
                    <Tab label="Loaded files" className="header">
                        <SelectableList>
                            {
                                this.state.loadedFiles.map((item, index) => (
                                    <ElementOfSelectableList
                                        key={index}
                                        index={index}
                                        item={item}
                                        selectFunction={this.selectCurrentFile}
                                    />
                                ))
                            }
                        </SelectableList>
                    </Tab>

                    <Tab label="Recent files" className="header">
                        <SelectableList>
                            {
                                this.state.recentFiles.map((item, index) => (
                                    <ElementOfSelectableList
                                        key={index}
                                        index={index}
                                        item={item}
                                        selectFunction={this.selectCurrentFileFromRecentFile}
                                    />
                                ))
                            }
                        </SelectableList>
                    </Tab>
                </Tabs>
                <RaisedButton
                    className="compare-button"
                    label="Compare files"
                    onClick={this.test}
                    primary={true}
                />
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
