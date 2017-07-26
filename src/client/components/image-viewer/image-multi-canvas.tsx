import * as React from 'react';
import { ImageCanvas } from './image-canvas';
import { Slider } from 'material-ui';

export interface ImageMultiCanvasProps {
    data: Uint8Array;
    numberOfFrames: number;
}

export interface ImageMultiCanvasState {
    sliderActualIndex: number;
}

export class ImageMultiCanvas extends React.Component<ImageMultiCanvasProps, ImageMultiCanvasState> {
    public constructor(props: ImageMultiCanvasProps) {
        super(props);

        this.state = {
            sliderActualIndex: 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    public componentWillReceiveProps(nextProps: ImageMultiCanvasProps) {
        this.setState({
            sliderActualIndex: 0
        });
    }

    public render() {
        return (
            <div>
                <h4>Image {this.state.sliderActualIndex + 1} of {this.props.numberOfFrames}</h4>
                <ImageCanvas data={this.props.data} frameIndex={this.state.sliderActualIndex}/>
                <Slider
                    disabled={this.props.numberOfFrames <= 1 ? true : false}
                    onChange={(event, newValue) => { this.handleChange(event, newValue); }}
                    step={1}
                    value={this.state.sliderActualIndex}
                    max={this.props.numberOfFrames === 0 ? 1 : this.props.numberOfFrames - 1}
                />
            </div>
        );
    }

    private handleChange(event: React.MouseEvent<{}>, newValue: number) {
        this.setState({
            sliderActualIndex: newValue
        });
    }

}