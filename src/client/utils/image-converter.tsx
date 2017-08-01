'use strict';

// creates a 64B string from unit8Array
export function getImageFromUnitArray(dicomImg: Uint8Array) {
    var binstr = Array.prototype.map.call(dicomImg, function (ch: number) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr); 
}