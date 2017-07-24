import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DicomTableRow } from "../../src/client/components/dicom-table/dicom-table-row";
import { DicomTable } from "../../src/client/components/dicom-table/dicom-table";
import { DicomTableHeader } from "../../src/client/components/dicom-table/dicom-table-header";

const arrayTest = {
    '0008': {
        groupNumber: '0008',
        groupName: '0111',
        entries: [
            {
                tagGroup: '0008',
                tagElement: '0145',
                tagName: 'PatientName',
                tagValue: 'Michal Mrkvicka',
                tagVR: 'PN',
                tagVM: '2'
            },
            {
                tagGroup: '0008',
                tagElement: '1548',
                tagName: 'PatientAge',
                tagValue: '18',
                tagVR: 'PA',
                tagVM: '1'
            }
        ]
    },
    '0010': {
        groupNumber: '0010',
        groupName: '0111',
        entries: [
            {
                tagGroup: '0010',
                tagElement: '0145',
                tagName: 'PatientName',
                tagValue: 'Michal Mrkvicka',
                tagVR: 'PN',
                tagVM: '2'
            },
            {
                tagGroup: '0010',
                tagElement: '1548',
                tagName: 'PatientAge',
                tagValue: '18',
                tagVR: 'PA',
                tagVM: '1'
            }
        ]
    }
}

const dicomTestEntry = {
    tagGroup: '0152',
    tagElement: '0145',
    tagName: 'PatientName',
    tagValue: 'Michal Mrkvicka',
    tagVR: 'PN',
    tagVM: '2'
}


describe('dicom-table', () => {
    it('Render one row with DICOM entry', () => {
        const div = shallow(<DicomTableRow entry={dicomTestEntry} />);
        expect(div.find('TableRow').find('TableRowColumn').length).to.equal(5);
    });

    it('Render DicomTable with the correct amount of expandable lists', () => {
        const div = shallow(<DicomTable data={arrayTest} />);
        expect(div.find('List').find('ListItem').length).to.equal(2);
    });

    it('Render correct value of second column - tagName', () => {
       const div = shallow(<DicomTableRow entry={dicomTestEntry} />);
       expect(div.find('TableRow').childAt(1).getNode().props.children).to.equal(dicomTestEntry.tagName);
    });
    it('Render one row with DICOM entry', () => {
       const div = shallow(<DicomTableRow entry={dicomTestEntry} />);
       expect(div.find('TableRow').find('TableRowColumn').length).to.equal(5);
   });

   it('Render DicomTable with correct header', () => {
       const div = shallow(<DicomTableHeader />);
       expect(div.find('TableRow').find('TableHeaderColumn').length).to.equal(5);
   });

   it('Render DicomTable with List containing data', () => {
       const div = shallow(<DicomTable data={arrayTest} />);
       expect(div.find('List').children('ListItem').length).to.equal(2);
   });

   it('Render DicomTable with List without data', () => {
       const div = shallow(<DicomTable data={{}} />);
       expect(div.find('List').children('ListItem').length).to.equal(0);
   });

// describe('dicom-table', () => {
//     it('Render received data in the right order', () => {
//         const div = shallow(<DicomTableRow entry={dicomTestEntry} />);
//         expect(div.find('TableRow').childAt(0).find('TableRowColumn')).to.have.value(dicomTestEntry.tagGroup);
//     });

    // it('Render DicomTable contains one table header', () => {
    //     const div = shallow(<DicomTable data={{}} />);
    //     expect(div.find('TableHeader').length).to.equal(1);
    // });

    // it('Render DicomTable contains one table body', () => {
    //     const div = shallow(<DicomTable data={{}} />);
    //     expect(div.find('TableBody').length).to.equal(1);
    // });

    // it('Render DicomTable with empty data creates empty table', () => {
    //     const div = shallow(<DicomTable data={{}} />);
    //     expect(div.find('TableBody').find('TableRow').length).to.equal(0);
    // });

    // it('Render DicomTable with data creates table', () => {
    //     const div = shallow(<DicomTable data={arrayTest} />);
    //     expect(div.find('TableBody').find('TableRow').length).to.equal(2);
    // });
});