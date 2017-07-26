import * as React from 'react';
import './image-viewer.css';
import { ImageMultiCanvas } from './image-viewer/image-multi-canvas';
import { DicomReader } from '../utils/dicom-reader';

interface ImageViewerProps  {
    data: Uint8Array;
}

let dicomReader: DicomReader = new DicomReader();

export default class ImageViewer extends React.Component<ImageViewerProps, {}> {
    constructor(props: ImageViewerProps) {
        super(props);
    }

    render() {
        let num = dicomReader.getNumberOfFrames(this.props.data);
        return (
            <div>
                <h1>ImageViewer</h1>  
                <ImageMultiCanvas 
                    data={this.props.data} 
                    numberOfFrames={num}                    
                />
            </div>
        );
    }

}