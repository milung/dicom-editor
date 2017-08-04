import * as React from 'react';
import { MenuItem, Drawer, AppBar } from 'material-ui';
import './navigation.css';

export interface NavigationProps {
}

export interface NavigationState {
    sideBarOpen: boolean;
}

export class Navigation extends React.Component<NavigationProps, NavigationState> {
    public constructor(props: NavigationProps) {
        super(props);

        this.state = {
            sideBarOpen: false
        };
    }

    public render() {
        return (

            <div>
                <Drawer
                    open={this.state.sideBarOpen}
                    docked={false}

                    onRequestChange={(sideBarOpen) => this.setState({ sideBarOpen })}
                >
                    <MenuItem primaryText="Export" />
                </Drawer>

                <AppBar
                    className="app-bar"
                    title="Dicom Viewer"
                    onLeftIconButtonTouchTap={() => { this.setState({ sideBarOpen: !this.state.sideBarOpen }); }}
                />

            </div>

        );
    }
}