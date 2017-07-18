import { DicomReader } from "./DicomReader";
import { DicomEntry } from "./model/dicom-entry";

export class FileConverter {

    public constructor() {

    }

    public getData(file: File): Promise<DicomEntry[]> {
        return new Promise<DicomEntry[]>((resolve, reject) => {

            let reader = new FileReader();
            console.log(reader.readyState);
            reader.readAsArrayBuffer(file);

            reader.onloadend = function (event) {

                let byteArray = new Uint8Array(reader.result);
                let dicomReader = new DicomReader();
                dicomReader.getData(byteArray)
                    .then(_ => {

                        resolve(_);
                    });
            }
        });
    }
}