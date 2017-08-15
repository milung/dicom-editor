import * as React from 'react';
import './empty-viewer.css';

export interface EmptyViewerProps {

}

export interface EmptyViewerState {

}

export class EmptyViewer extends React.Component<EmptyViewerProps, EmptyViewerState> {
    public constructor(props: EmptyViewerProps) {
        super(props);
    }

    public render() {
        return (
            <div className="empty-viewer-wrapper">
                <div className="empty-viewer-text">
                    <h1>No file loaded</h1>
                    Drag and drop a file here<br/>
                    or choose from saved
                </div>
            </div>
        );
    }
}