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
    leftArrowStyle: {};
    rightArrowStyle: {};
}

const enabledArrow: {} = {
    cursor: 'pointer',
    color: 'black'
};

const disabledArrow: {} = {
    cursor: 'auto',
    color: 'gray'
};

export class ImageMultiCanvas extends React.Component<ImageMultiCanvasProps, ImageMultiCanvasState> {
    public constructor(props: ImageMultiCanvasProps) {
        super(props);

        this.state = {
            sliderActualIndex: 0,
            leftArrowStyle: disabledArrow,
            rightArrowStyle: disabledArrow
        };

        this.handleChange = this.handleChange.bind(this);
    }

    public componentWillReceiveProps(nextProps: ImageMultiCanvasProps) {
        this.setState({
            sliderActualIndex: 0,
            rightArrowStyle: nextProps.numberOfFrames <= 1 ? disabledArrow : enabledArrow,
            leftArrowStyle: disabledArrow
        });
    }

    public render() {
        return (
            <div className="image_viewer_container">
                <div>
                    <h3>Image {this.state.sliderActualIndex + 1} of {this.props.numberOfFrames}</h3>
                </div>

                <div className="center" style={{ width: '512px' }}>
                    <Slider
                        onChange={(event, newValue) => { this.handleChange(event, newValue); }}
                        step={1}
                        value={this.state.sliderActualIndex}
                        max={this.props.numberOfFrames <= 1 ? 1 : this.props.numberOfFrames - 1}
                    />
                </div>
                <div className="image_control">
                    <div className="arrow_style">
                        <ArrowLeft
                            onClick={() => { this.handleArrowClick('left'); }}
                            style={this.state.leftArrowStyle}
                        />
                    </div>
                    <ImageCanvas data={this.props.data} frameIndex={this.state.sliderActualIndex} />
                    <div className="arrow_style">
                        <ArrowRight
                            onClick={() => { this.handleArrowClick('right'); }}
                            style={this.state.rightArrowStyle}
                        />
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

    private handleArrowClick(arrow: string) {
        switch (arrow) {
            case 'left': {

                if (this.state.sliderActualIndex > 0) {
                    let leftStyle = this.state.sliderActualIndex - 1 === 0 ? disabledArrow : enabledArrow;
                    this.setState({
                        sliderActualIndex: this.state.sliderActualIndex - 1,
                        leftArrowStyle: leftStyle,
                        rightArrowStyle: enabledArrow
                    });
                }
                break;
            }
            case 'right': {

                if (this.state.sliderActualIndex + 1 < this.props.numberOfFrames) {
                    let rightStyle = this.state.sliderActualIndex + 2 === this.props.numberOfFrames
                        ? disabledArrow
                        : enabledArrow;
                    this.setState({
                        sliderActualIndex: this.state.sliderActualIndex + 1,
                        rightArrowStyle: rightStyle,
                        leftArrowStyle: enabledArrow
                    });

                }
                break;
            }
            default: {
                return;
            }
        }
    }
}