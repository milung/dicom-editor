import * as React from 'react';
import { ImageMultiCanvas } from '.././image-viewer/image-multi-canvas';
import { ImageCanvas } from '.././image-viewer/image-canvas';
import { DicomReader } from '../../utils/dicom-reader';

interface ImageViewerProps {
    data: Uint8Array;
}

let dicomReader: DicomReader = new DicomReader();

export default class ImageViewer extends React.Component<ImageViewerProps, {}> {
    constructor(props: ImageViewerProps) {
        super(props);
    }

    render() {
        let num = dicomReader.getNumberOfFrames(this.props.data);
        if (num === 1) {
            return (
                <div>
                    <ImageCanvas
                        data={this.props.data}
                        frameIndex={0}
                    />
                </div>
            );
        } else if (num > 1) {
            return (
                <div>
                    <ImageMultiCanvas
                        data={this.props.data}
                        numberOfFrames={num}
                    />
                </div>
            );
        }

        return(
            <div>No image loaded</div>
        );

    }

}