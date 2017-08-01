import * as React from 'react';
import * as cornerstone from '../../../assets/js/cornetstone-library/cornerstone.js';
import { buffersEqual } from '../../utils/file-converter';
var cornerstoneWADOImageLoader = require('./cornerstone-library/DCMLoader');
import './image-canvas.css';
import { FlatButton } from 'material-ui';

import { getImageFromUnitArray } from '../../utils/image-converter';
var fileDownload = require('react-file-download');
import * as dicomParser from 'dicom-parser';

interface ImageCanvasProps {
  data: Uint8Array;
  frameIndex: number;
}

export class ImageCanvas extends React.Component<ImageCanvasProps, {}> {

  constructor(props: ImageCanvasProps) {
    super(props);
  }

  renderCanvas(data: Uint8Array) {
    var imageElement = document.getElementById('dicomImage') as Element;

    var fileNew = new Blob([data], { type: 'File' });

    var imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileNew);
    imageId = imageId + '?frame=' + this.props.frameIndex;

    cornerstone.loadImage(imageId).then(function (image: Object) {
      var viewport = cornerstone.getDefaultViewport(imageElement.children[0], image);
      cornerstone.displayImage(imageElement, image, viewport);
    });
  }

  componentDidMount() {
    var element = document.getElementById('dicomImage') as Element;
    cornerstone.enable(element);

    if (this.props.data.length > 0) {
      this.renderCanvas(this.props.data);
    }
  }
  componentDidUpdate() {
    if (this.props.data.length > 0) {
      this.renderCanvas(this.props.data);
    }
  }

  shouldComponentUpdate(nextProps: ImageCanvasProps) {
    // component should update if data has changed or frame index has changed
    return (!buffersEqual(nextProps.data, this.props.data) || this.props.frameIndex !== nextProps.frameIndex);
  }

  render() {
    return (
      <div>
        <FlatButton
          onTouchTap={() => this.createImg(this.props.data)}
        />
        <div className="center" id="dicomImage" style={{ width: '512px', height: '512px' }} />
      </div>
    );
  }

  private createImg(byteArray: Uint8Array) {

    try {
      // Parse the byte array to get a DataSet object that has the parsed contents
      var dataSet = dicomParser.parseDicom(byteArray/*, options */);
      // access a string element
      // var studyInstanceUid = dataSet.string('x0020000d');
      // get the pixel data element (contains the offset and length of the data)
      var pixelDataElement = dataSet.elements.x7fe00010;

      // create a typed array on the pixel data (this example assumes 16 bit unsigned data)
      var pixelData = new Uint8Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length);
      
      let img = getImageFromUnitArray(pixelData);
      let file = ('data:image/png;base64,').concat(img);
      fileDownload(file, 'filename.png');
  }
    catch (ex) {
      console.log('Error parsing byte stream');
    }
  }

}