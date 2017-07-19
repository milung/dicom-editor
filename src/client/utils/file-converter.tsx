export function convertFileToArrayBuffer(file: File): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {

        let reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = function (event: Event) {
            resolve(new Uint8Array(reader.result));
        };
    });
}
