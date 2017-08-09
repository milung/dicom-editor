"use strict";

var excel = require('./lib/excel');

var buildExport = function buildExport(params) {
  if (!(params instanceof Array)) throw 'buildExport expects an array';

  var sheets = [];
  params.forEach(function (sheet, index) {
    var specification = sheet.specification;
    var dataset = sheet.data;
    var sheet_name = sheet.name || 'Sheet' + index + 1;
    var data = [];
    var merges = sheet.merges;
    var config = {
      cols: []
    };

    if (!specification || !dataset) throw 'missing specification or dataset.';

    if (sheet.heading) {
      sheet.heading.forEach(function (row) {
        data.push(row);
      });
    }

    //build the header row
    var header = [];
    for (var col in specification) {
      header.push({
        value: specification[col].displayName,
        style: specification[col].headerStyle || ''
      });

      if (specification[col].width) {
        if (Number.isInteger(specification[col].width)) {
          config.cols.push({ wpx: specification[col].width });
        } else if (Number.isInteger(parseInt(specification[col].width))) {
          config.cols.push({ wch: specification[col].width });
        } else {
          throw 'Provide column width as a number';
        }
      } else {
        config.cols.push({});
      }
    }
    data.push(header //Inject the header at 0

    );dataset.forEach(function (record) {
      var row = [];
      for (var _col in specification) {
        var cell_value = record[_col];

        if (specification[_col].cellFormat && typeof specification[_col].cellFormat == 'function') {
          cell_value = specification[_col].cellFormat(record[_col], record);
        }

        if (specification[_col].cellStyle && typeof specification[_col].cellStyle == 'function') {
          cell_value = {
            value: cell_value,
            style: specification[_col].cellStyle(record[_col], record)
          };
        } else if (specification[_col].cellStyle) {
          cell_value = {
            value: cell_value,
            style: specification[_col].cellStyle
          };
        }
        row.push(cell_value // Push new cell to the row
        );
      }
      data.push(row // Push new row to the sheet
      );
    });

    sheets.push({
      name: sheet_name,
      data: data,
      merge: merges,
      config: config
    });
  });

  return excel.build(sheets);
};

module.exports = {
  buildExport: buildExport
};