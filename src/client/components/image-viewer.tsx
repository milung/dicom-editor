import * as React from 'react';
import './image-viewer.css';
import { ImageCanvas } from './image-viewer/image-canvas';

interface ImageViewerProps  {
    data: Uint8Array;
}
export default class ImageViewer extends React.Component<ImageViewerProps, {}> {
    render() {
        return (
            <div>
                <h1>ImageViewer</h1>  
                <ImageCanvas data={this.props.data} />
            </div>
        );
    }
}