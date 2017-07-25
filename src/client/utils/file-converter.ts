/**
 * Converts File object to array buffer
 * @param file File object to convert
 * @return Uint8Array array of loaded bytes
 */
export function convertFileToArrayBuffer(file: File): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {

        let reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = function (event: Event) {
            resolve(new Uint8Array(reader.result));
        };
        reader.onerror = (err) => {
            reject(err);
        };
    });
}

/**
 * @description Checks if two array buffers equal
 * @param {Uint8Array} buf1 first buffer to check
 * @param {Uint8Array} buf2 second buffer to check
 * @returns true if buffers equal, false otherwise
 */
export function buffersEqual(buf1: Uint8Array, buf2: Uint8Array) {
    if (buf1.byteLength !== buf2.byteLength) {
        return false;
    }
    var dv1 = new Int8Array(buf1);
    var dv2 = new Int8Array(buf2);
    for (var i = 0; i !== buf1.byteLength; i++) {
        if (dv1[i] !== dv2[i]) {
            return false;
        }
    }
    return true;
}
