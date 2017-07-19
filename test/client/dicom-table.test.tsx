import * as React from 'react';
import { DicomTable } from '../../src/client/components/dicom-table/dicom-table';
import { shallow } from 'enzyme';
import { expect } from 'chai';

const arrayTest = {
   '0008': {
       groupNumber: '0008',
       groupName: '0111',
       entries: [
           {
               tagGroup: '0152',
               tagElement: '0145',
               tagName: 'PatientName',
               tagValue: 'Michal Mrkvicka'
           },
           {
               tagGroup: '5478',
               tagElement: '1548',
               tagName: 'PatientAge',
               tagValue: '18'
           }
       ]
   }
}


describe('dicom-table', () => {
   it('Render DicomTable contains one table', () => {
       const div = shallow(<DicomTable data={{}} />);
       expect(div.find('Table').length).to.equal(1);
   });

   it('Render DicomTable contains one table header', () => {
       const div = shallow(<DicomTable data={{}} />);
       expect(div.find('TableHeader').length).to.equal(1);
   });

   it('Render DicomTable contains one table body', () => {
       const div = shallow(<DicomTable data={{}} />);
       expect(div.find('TableBody').length).to.equal(1);
   });

   it('Render DicomTable with empty data creates empty table', () => {
       const div = shallow(<DicomTable data={{}} />);
       expect(div.find('TableBody').find('TableRow').length).to.equal(0);
   });

   it('Render DicomTable with data creates table', () => {
       const div = shallow(<DicomTable data={arrayTest} />);
       expect(div.find('TableBody').find('TableRow').length).to.equal(2);
   });
});