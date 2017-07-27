import * as React from 'react';
import { ImageCanvas } from './image-canvas';
import { Slider } from 'material-ui';
import './image-multi-canvas.css';

var ArrowRight = require('react-icons/lib/md/arrow-forward');
var ArrowLeft = require('react-icons/lib/md/arrow-back');

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
            <div className="image_viewer_container">
                <div>
                    <h3>Image {this.state.sliderActualIndex + 1} of {this.props.numberOfFrames}</h3>
                </div>
                <div style={{ width: '512px' }}>
                    <Slider
                        disabled={this.props.numberOfFrames <= 1 ? true : false}
                        onChange={(event, newValue) => { this.handleChange(event, newValue); }}
                        step={1}
                        value={this.state.sliderActualIndex}
                        max={this.props.numberOfFrames === 0 ? 1 : this.props.numberOfFrames - 1}
                    />
                </div>
                <div className="image_control">
                    <div className="arrow_style">
                        <ArrowLeft style={{cursor: 'pointer'}}/>
                    </div>
                    <ImageCanvas data={this.props.data} frameIndex={this.state.sliderActualIndex} />
                    <div className="arrow_style">
                        <ArrowRight style={{cursor: 'pointer'}}/>
                    </div>
                </div>
            </div>            
        );
    }

    private handleChange(event: React.MouseEvent<{}>, newValue: number) {
        this.setState({
            sliderActualIndex: newValue
        });
    }

}