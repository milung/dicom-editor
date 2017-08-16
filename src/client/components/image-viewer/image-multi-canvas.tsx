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
            rightArrowStyle: enabledArrow
        };

        this.handleChange = this.handleChange.bind(this);
    }

    public componentWillReceiveProps(nextProps: ImageMultiCanvasProps) {
        this.setState({
            sliderActualIndex: 0,
            rightArrowStyle: enabledArrow,
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
                        onChange={(event, newValue) => { this.handleChange(newValue); }}
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

    private handleChange(newValue: number) {
        if (newValue === 0) {
            this.setState({
                leftArrowStyle: disabledArrow,
                rightArrowStyle: enabledArrow
            });
        } else if (newValue === this.props.numberOfFrames - 1) {
            this.setState({
                leftArrowStyle: enabledArrow,
                rightArrowStyle: disabledArrow
            });
        } else {
            this.setState({
                leftArrowStyle: enabledArrow,
                rightArrowStyle: enabledArrow
            });
        }
        this.setState({
            sliderActualIndex: newValue
        });
    }

    private handleArrowClick(arrow: string) {
        switch (arrow) {
            case 'left': {
                if (this.state.sliderActualIndex > 0) {
                    this.handleChange(this.state.sliderActualIndex - 1);
                }
                break;
            }
            case 'right': {
                if (this.state.sliderActualIndex + 1 < this.props.numberOfFrames) {
                    this.handleChange(this.state.sliderActualIndex + 1);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
}