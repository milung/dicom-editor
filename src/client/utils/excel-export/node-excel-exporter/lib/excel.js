'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var XLSX = require('xlsx-style');

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, merges) {
  var ws = {};
  var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (var R = 0; R !== data.length; ++R) {
    for (var C = 0; C !== data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;

      var cell = void 0;
      if (data[R][C] && _typeof(data[R][C]) === 'object' && data[R][C].style && !(data[R][C] instanceof Date)) {
        cell = {
          v: data[R][C].value,
          s: data[R][C].style
        };
      } else {
        cell = { v: data[R][C] };
      }

      if (cell.v === null) continue;
      var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

      if (typeof cell.v === 'number') cell.t = 'n';else if (typeof cell.v === 'boolean') cell.t = 'b';else if (cell.v instanceof Date) {
        cell.t = 'n';cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }

  if (merges) {
    if (!ws['!merges']) ws['!merges'] = [];
    merges.forEach(function (merge) {
      ws['!merges'].push({
        s: {
          r: merge.start.row - 1,
          c: merge.start.column - 1
        },
        e: {
          r: merge.end.row - 1,
          c: merge.end.column - 1
        }
      });
    });
  }

  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

module.exports = {
  parse: function parse(mixed, options) {
    var ws = void 0;
    if (typeof mixed === 'string') ws = XLSX.readFile(mixed, options);else ws = XLSX.read(mixed, options);
    return _.map(ws.Sheets, function (sheet, name) {
      return { name: name, data: XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true }) };
    });
  },
  build: function build(array) {
    var defaults = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    };
    var wb = new Workbook();
    array.forEach(function (worksheet) {
      var name = worksheet.name || 'Sheet';
      var data = sheet_from_array_of_arrays(worksheet.data || [], worksheet.merge);
      wb.SheetNames.push(name);
      wb.Sheets[name] = data;

      if (worksheet.config.cols) {
        wb.Sheets[name]['!cols'] = worksheet.config.cols;
      }
    });

    var data = XLSX.write(wb, defaults);
    if (!data) return false;
    var buffer = new Buffer(data, 'binary');
    return buffer;
  }
};