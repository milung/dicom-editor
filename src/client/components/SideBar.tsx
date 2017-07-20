import * as React from 'react';

import Paper from 'material-ui/Paper';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import {  Tabs, Tab  } from 'material-ui/Tabs';

// import FontIcon from 'material-ui/FontIcon';
// icon={<FontIcon className="material-icons">restore</FontIcon>}

import './SideBar.css';

export interface SideBarProps {
    // loadedFiles: File[],
    // recentFiles: File[]
}

const SelectableList = makeSelectable(List);

export default class SideBar extends React.Component<SideBarProps, {}> {
    render() {
        return (
            <Paper className="side-bar">
                <Tabs>
                    <Tab
                        label="Loaded files"
                    >
                        <SelectableList>
                            {
                                ['81',  '82',  '83',  '84'].map((item, index) => (
                                    <ListItem
                                        key={index}
                                        value={item}
                                        primaryText={item}
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
                                ['1',  '2',  '3',  '4'].map((item) => (
                                    <ListItem
                                        key={item}
                                        value={item}
                                        primaryText={item}
                                    />
                                ))
                            }
                        </SelectableList>
                    </Tab>
                </Tabs>

            </Paper>
        );
    }
}
