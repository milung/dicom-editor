import { DicomReader } from "./DicomReader";

export class FileConverter {

    public constructor(file: File){
        let reader = new FileReader();
        console.log(reader.readyState);
        reader.readAsArrayBuffer(file);
        reader.onloadend = function(event) {

            console.log('ReadyState: ' + reader.readyState);
            let byteArray = new Uint8Array(reader.result);
            let dicomReader = new DicomReader(byteArray);
            dicomReader;
        }
        
    }

}