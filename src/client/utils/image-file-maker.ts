var toBlob = require('canvas-to-blob');

/**
 * @description takes image-canvas and converts it into a png file
 * @return file (blob) or null
 */
export function getImageFile() {
    let canvas = document.getElementById('image-canvas') as HTMLCanvasElement;
    if (canvas) {
        let url = canvas.toDataURL();
        return toBlob(url);
    }
    return null;
}