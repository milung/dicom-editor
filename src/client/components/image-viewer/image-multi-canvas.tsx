import * as React from 'react';
import { ImageCanvas } from './image-canvas';
import { Slider } from 'material-ui';
import 'material-design-icons';

export interface ImageMultiCanvasProps {
    dataImages: Uint8Array[];
}

export interface ImageMultiCanvasState {
    dataImages: Uint8Array[];
    actualData: Uint8Array;
    sliderActualIndex: number;
}

export class ImageMultiCanvas extends React.Component<ImageMultiCanvasProps, ImageMultiCanvasState> {
    public constructor(props: ImageMultiCanvasProps) {
        super(props);

        console.log(this.props);

        this.state = {
            dataImages: this.props.dataImages,
            actualData: this.props.dataImages[0],
            sliderActualIndex: 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    public componentWillReceiveProps(nextProps: ImageMultiCanvasProps) {
        this.setState({
            dataImages: nextProps.dataImages,
            actualData: nextProps.dataImages[0]
        });
    }

    public render() {
        return (
            <div>
                <h4>Image {this.state.sliderActualIndex + 1} of {this.state.dataImages.length}</h4>
                <ImageCanvas data={this.state.actualData} />
                <Slider disabled={this.state.dataImages.length <= 1 ? true : false} onChange={(event, newValue) => {this.handleChange(event, newValue)}} step={(1 / this.state.dataImages.length)} value={this.state.sliderActualIndex + 1} />
            </div>
        );
    }

    private handleChange(event: React.MouseEvent<{}>, newValue: number) {
        let actIndex = this.getIndexFromSliderValue(newValue) - 1;
        this.setState({
            sliderActualIndex: actIndex,
            actualData: this.state.dataImages[actIndex]
        });
    }

    private getIndexFromSliderValue(sliderValue: number): number {
        return this.state.dataImages.length * sliderValue;
    }
}