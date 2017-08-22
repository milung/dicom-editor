import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DicomTableRow } from "../../src/client/components/dicom-table/dicom-table-row";
import { DicomExtendedTable } from "../../src/client/components/dicom-table/dicom-extended-table";
import { DicomTableHeader } from "../../src/client/components/dicom-table/dicom-table-header";
import { DicomSimpleTable } from "../../src/client/components/dicom-table/dicom-simple-table";
import { DicomSimpleComparisonTable } from "../../src/client/components/dicom-table/dicom-simple-comparison-table";

const arrayTest = {
    'Module 1':
    [
        {
            offset: 12345,
            byteLength: 0,
            tagGroup: '0008',
            tagElement: '0145',
            tagName: 'PatientName',
            tagValue: 'Michal Mrkvicka',
            tagVR: 'PN',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        },
        {
            offset: 12345,
            byteLength: 0,
            tagGroup: '0008',
            tagElement: '1548',
            tagName: 'PatientAge',
            tagValue: '18',
            tagVR: 'PA',
            tagVM: '1',
            colour: '#000000',
            sequence: []
        }
    ]
    ,
    'Module 2':
    [
        {
            offset: 12345,
            byteLength: 0,
            tagGroup: '0010',
            tagElement: '0145',
            tagName: 'PatientName',
            tagValue: 'Michal Mrkvicka',
            tagVR: 'PN',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        },
        {
            offset: 12345,
            byteLength: 0,
            tagGroup: '0010',
            tagElement: '1548',
            tagName: 'PatientAge',
            tagValue: '18',
            tagVR: 'PA',
            tagVM: '1',
            colour: '#000000',
            sequence: []
        }
    ]
}


const dicomTestEntry = {
    offset: 12345,
    byteLength: 0,
    tagGroup: '0152',
    tagElement: '0145',
    tagName: 'PatientName',
    tagValue: 'Michal Mrkvicka',
    tagVR: 'PN',
    tagVM: '2',
    colour: '#000000',
    sequence: []
}

const dicomTestEntries =
    [
        {
            offset: 12345,
            byteLength: 0,
            tagGroup: '0152',
            tagElement: '0145',
            tagName: 'PatientName',
            tagValue: 'Michal Mrkvicka',
            tagVR: 'PN',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        },
        {
            offset: 12345,
            byteLength: 0,
            tagGroup: '0010',
            tagElement: '1548',
            tagName: 'PatientAge',
            tagValue: '18',
            tagVR: 'PA',
            tagVM: '1',
            colour: '#000000',
            sequence: []
        },
        {
            offset: 12345,
            byteLength: 0,
            tagGroup: '0152',
            tagElement: '0145',
            tagName: 'PatientName',
            tagValue: 'Michal Mrkvicka',
            tagVR: 'PN',
            tagVM: '2',
            colour: '#000000',
            sequence: []
        },
        {
            offset: 12345,
            byteLength: 0,
            tagGroup: '0010',
            tagElement: '1548',
            tagName: 'PatientAge',
            tagValue: '18',
            tagVR: 'PA',
            tagVM: '1',
            colour: '#000000',
            sequence: []
        }
    ]

const dicomSequenceTestEntry = [
    {
        offset: 12345,
        byteLength: 0,
        tagGroup: '0152',
        tagElement: '0145',
        tagName: 'PatientName',
        tagValue: 'Michal Mrkvicka',
        tagVR: 'PN',
        tagVM: '2',
        colour: '#000000',
        sequence:
        [
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0146',
                tagName: 'PatientName',
                tagValue: 'Michal Mrkvicka',
                tagVR: 'PN',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            },
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0147',
                tagName: 'PatientGender',
                tagValue: 'M',
                tagVR: 'PG',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            },
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0147',
                tagName: 'PatientDiet',
                tagValue: 'Apple',
                tagVR: 'PD',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ]
    }
]

const comparisonData = [
    {
        group:
        [
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0146',
                tagName: 'PatientName',
                tagValue: 'Michal Mrkvicka',
                tagVR: 'PN',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            },
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0146',
                tagName: 'PatientName',
                tagValue: 'Nemichal',
                tagVR: 'PN',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ],
        tagGroup: '0152',
        tagElement: '0147'
    },
    {
        group: [
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0146',
                tagName: 'PatientName',
                tagValue: 'Michal Mrkvicka',
                tagVR: 'PN',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            },
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0146',
                tagName: 'PatientName',
                tagValue: 'Nemichal Nemrkvicka',
                tagVR: 'PN',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ],
        tagGroup: '0152',
        tagElement: '0147'
    },
    {
        group: [
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0146',
                tagName: 'PatientName',
                tagValue: 'Michal Mrkvicka',
                tagVR: 'PN',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ],
        tagGroup: '0152',
        tagElement: '0147'
    }
]

const comparisonDataNoDiffs = [
    {
        group: [
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0146',
                tagName: 'PatientName',
                tagValue: 'Michal Mrkvicka',
                tagVR: 'PN',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ],
        tagGroup: '0152',
        tagElement: '0147'
    },
    {
        group: [
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0146',
                tagName: 'PatientName',
                tagValue: 'Michal Mrkvicka',
                tagVR: 'PN',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ],
        tagGroup: '0152',
        tagElement: '0147'
    }
]

const comparisonHeaderData = [
    {
        group: [
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0146',
                tagName: 'PatientName',
                tagValue: 'Michal Mrkvicka',
                tagVR: 'PN',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ],
        tagGroup: '0152',
        tagElement: '0147'
    },
    {
        group: [
            {
                offset: 12345,
                byteLength: 0,
                tagGroup: '0152',
                tagElement: '0146',
                tagName: 'PatientName',
                tagValue: 'Michal Mrkvicka',
                tagVR: 'PN',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            }
        ],
        tagGroup: '0152',
        tagElement: '0147'
    }
]

describe('dicom-table', () => {
    it('Render one row with DICOM entry', () => {
        const div = shallow(<DicomTableRow entry={dicomTestEntry} shouldShowTag={true} />);
        expect(div.find('TableRow').find('TableRowColumn').length).to.equal(5);
    });

    it('Render DicomTable with the correct amount of expandable lists', () => {
        const div = shallow(<DicomExtendedTable data={arrayTest} />);
        expect(div.find('List').find('ListItem').length).to.equal(2);
    });

    it('Render correct value of second column - tagName', () => {
        const div = shallow(<DicomTableRow entry={dicomTestEntry} shouldShowTag={true} />);
        expect(div.find('TableRow').childAt(1).getNode().props.children).to.equal(dicomTestEntry.tagName);
    });
    it('Render one row with DICOM entry', () => {
        const div = shallow(<DicomTableRow entry={dicomTestEntry} shouldShowTag={true} />);
        expect(div.find('TableRow').find('TableRowColumn').length).to.equal(5);
    });

    it('Render DicomTable with correct header', () => {
        const div = shallow(<DicomTableHeader />);
        expect(div.find('TableRow').find('TableHeaderColumn').length).to.equal(5);
    });

    it('Render DicomTable with List containing data', () => {
        const div = shallow(<DicomExtendedTable data={arrayTest} />);
        expect(div.find('List').children('ListItem').length).to.equal(2);
    });

    it('Render DicomTable with List without data', () => {
        const div = shallow(<DicomExtendedTable data={{}} />);
        expect(div.find('List').children('ListItem').length).to.equal(0);
    });

    it('Render the correct amount of rows in the table of entries within a single module', () => {
        const div = shallow(<DicomSimpleTable entries={dicomTestEntries} />);
        expect(div.find('Table').find('TableBody').children('DicomTableRow').length).to.equal(4);
    });

    it('Do not render sequence in simple table', () => {
        const div = shallow(<DicomSimpleTable entries={dicomSequenceTestEntry} />);
        expect(div.find('Table').find('TableBody').children('DicomTableRow').length).to.equal(0);
    });

    //    lateeeer  :(((((((((   
    //    it('Render sequence in simple table (after a click)', () => {
    //        const div = shallow(<DicomSimpleTable entries={dicomSequenceTestEntry}/>);
    //        div.find('Table').find('TableBody').childAt(1);
    //        expect(div.find('Table').find('TableBody').children('DicomTableRow').length).to.equal(0);
    //    });

    it('Render same row for simple comparison table', () => {
        const div = shallow(<DicomSimpleComparisonTable comparisonData={comparisonHeaderData} showOnlyDiffs={false} />);
        expect(div.find('Table').find('TableBody').children('DicomTableRow').length).to.equal(2);
    });

    it('Render different rows for simple comparison table', () => {
        const div = shallow(<DicomSimpleComparisonTable comparisonData={comparisonData} showOnlyDiffs={false} />);
        expect(div.find('Table').find('TableBody').children('DicomTableRow').length).to.equal(7);
    });

    it('Render only differences in compare-mode', () => {
        const div = shallow(<DicomSimpleComparisonTable comparisonData={comparisonData} showOnlyDiffs={true} />);
        expect(div.find('Table').find('TableBody').children('DicomTableRow').length).to.equal(6);
    });

    it('Render only differences in compare-mode- should render empty table', () => {
        const div = shallow(
            <DicomSimpleComparisonTable comparisonData={comparisonDataNoDiffs} showOnlyDiffs={true} />);
        expect(div.find('Table').find('TableBody').children('DicomTableRow').length).to.equal(0);
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