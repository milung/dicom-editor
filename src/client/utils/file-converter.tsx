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
    });
}
