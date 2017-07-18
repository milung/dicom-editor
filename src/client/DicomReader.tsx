
var dicomParser = require('dicom-parser');

export class DicomReader{

    public constructor(bytes: Uint8Array){
        
        setTimeout(function(){
            var dataset;
            try{
               
                dataset = dicomParser.parseDicom(bytes);
                for (var propertyName in dataset.elements) {
                    var tmp = dataset.string(propertyName, 0);
                    console.log('property: ' + tmp);
                    let element = dataset.elements[propertyName];
                    //console.log('PropertyName: ' + propertyName);
                    //console.log('Tag: ' + element.vr);
                    if(element.fragments != null){
                        
                         for (var itemName in element.fragments){
                            var item = element.fragments[itemName]; 
                            console.log('ItemName: ' + itemName);
                            console.log('dataset: ' + item.dataset);
                         }
                    }
                       

                }
                

                console.log('Parsed succesfully. Behold: ');
            }
            catch(err){
                console.log('Error occured');
                var message = err;
                if(err.exception){
                    message = err.exception;
                }
            }
        }, 10);
            

    }

}