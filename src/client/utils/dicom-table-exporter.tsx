import { HeavyweightFile } from "../model/file-interfaces";
const excel = require('node-excel-export');

export function dicomDataToExcel(file: HeavyweightFile) {
  // Definition of cell styles
  const styles = {
    headerDark: {
      fill: {
        fgColor: {
          rgb: 'FF000000'
        }
      },
      font: {
        color: {
          rgb: 'FF00AAFF'
        },
        sz: 14,
        bold: true,
        underline: false
      },
      alignment: {
        horizontal: "center"
      }
    },
    titleDark: {
      fill: {
        fgColor: {
          rgb: 'FF000000'
        }
      },
      font: {
        color: {
          rgb: 'FF00BB00'
        },
        sz: 14,
        bold: true,
        underline: true
      },
      alignment: {
        horizontal: "center"
      }
    },
    cellRegular: {
      fill: {
        fgColor: {
          rgb: 'FFFFFFFF'
        }
      },
      font: {
        color: {
          rgb: 'FF000000'
        },
        sz: 12,
      },
      alignment: {
        horizontal: "center"
      }
    }
  };

  // Specification of columns and their titles
  const specification = {
    tag_number: {
      displayName: 'Tag group & element',
      headerStyle: styles.headerDark,
      cellStyle: styles.cellRegular,
      width: 120
    },
    tag_name: {
      displayName: 'Tag name',
      headerStyle: styles.headerDark,
      cellStyle: styles.cellRegular,
      width: 140
    },
    tag_value: {
      displayName: 'Tag value',
      headerStyle: styles.headerDark,
      cellStyle: styles.cellRegular,
      width: 200
    },
    tag_vr: {
      displayName: 'Tag VR',
      headerStyle: styles.headerDark,
      cellStyle: styles.cellRegular,
      width: 80
    },
    tag_vm: {
      displayName: 'Tag VM',
      headerStyle: styles.headerDark,
      cellStyle: styles.cellRegular,
      width: 80
    }
  };

  // Array of objects representing heading rows (very top) 
  const heading = [
    [{value: 'Dicom data from file: ' + file.fileName, style: styles.titleDark}]
  ];

  // The data to fill the rows with
  const dataset = [
    {}
  ];

  // Iterate over input data, fill the dataset with dicom entry attributes
  file.dicomData.entries.map((entry, index) => {
    dataset.push({
      tag_number: entry.tagGroup + ', ' + entry.tagElement,
      tag_name: entry.tagName,
      tag_value: entry.tagValue,
      tag_vr: entry.tagVR,
      tag_vm: entry.tagVM
    });
  });
  // Remove the first, empty element of the array
  dataset.shift();

  // Define an array of merges. 1-1 = A:1 
  // The merges are independent of the data. 
  // A merge will overwrite all data _not_ in the top-left cell. 
  const merges = [
    { start: { row: 1, column: 1 }, end: { row: 1, column: 5 } },
   // { start: { row: 2, column: 1 }, end: { row: 2, column: 2 } }
  ];

  // Create the excel report 
  // This function returns a Buffer 
  const report = excel.buildExport(
    [
      {
        name: 'DicomTable - ' + file.fileName,
        heading: heading,
        merges: merges,
        specification: specification,
        data: dataset
      }
    ]
  );

  return report;
}
