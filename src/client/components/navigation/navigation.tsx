import * as React from 'react';
import { MenuItem, Drawer, AppBar } from 'material-ui';
import './navigation.css';
import { ExportDialog } from '../export/export-dialog';
import { ApplicationStateReducer } from '../../application-state';

export interface NavigationProps {
    reducer: ApplicationStateReducer;
}

export interface NavigationState {
    sideBarOpen: boolean;
    openedExportDialog: boolean;
}

export class Navigation extends React.Component<NavigationProps, NavigationState> {
    public constructor(props: NavigationProps) {
        super(props);
        this.handleCloseExportDialog = this.handleCloseExportDialog.bind(this);

        this.state = {
            sideBarOpen: false,
            openedExportDialog: false
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
                    <MenuItem
                        primaryText="Export"
                        onClick={_ => this.showExportDialog()}
                    />
                    <ExportDialog
                        reducer={this.props.reducer}
                        handleClosePopUpDialog={this.handleCloseExportDialog}
                        openedPopUpDialog={this.state.openedExportDialog}
                    />
                </Drawer>

                <AppBar
                    className="app-bar"
                    title="Dicom Viewer"
                    onLeftIconButtonTouchTap={() => { this.setState({ sideBarOpen: !this.state.sideBarOpen }); }}
                />

            </div>

        );
    }

    private showExportDialog() {
        this.setState({
            openedExportDialog: true
        });
    }

    private handleCloseExportDialog() {
        this.setState({
            openedExportDialog: false,
            sideBarOpen: false
        });
    }
}