import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { MuiThemeProvider } from 'material-ui/styles';
import { Navigation } from '../../src/client/components/navigation/navigation';
import { ApplicationStateReducer } from "../../src/client/application-state";
import { ExportDialog } from "../../src/client/components/export/export-dialog";
var PropTypes = require('prop-types');
import fs = require('fs');
import { FileContent, FileService } from "../../src/client/components/file-loader/file-service";

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { containsImage, isMultiframe } from "../../src/client/utils/dicom-validator";

// enzyme MUI Test Helpers
// - https://github.com/callemall/material-ui/issues/4664

const muiTheme = getMuiTheme();

/**
* MuiMountWithContext
*
* For `mount()` full DOM rendering in enzyme.
* Provides needed context for mui to be rendered properly
* during testing.
*
* @param {obj}    node - ReactElement with mui as root or child
* @return {obj}   ReactWrapper (http://airbnb.io/enzyme/docs/api/ReactWrapper/mount.html)
*/

export const MuiMountWithContext = (node: JSX.Element) => mount(node, {
    context: { muiTheme },
    childContextTypes: { muiTheme: PropTypes.object },
});


describe('navigation', () => {
    it('should render navigation with drawer and app bar', () => {
        let reducer = new ApplicationStateReducer();
        let element = mount(
            <MuiThemeProvider>
                <Navigation reducer={reducer} />
            </MuiThemeProvider>
        )

        expect(element.find('Drawer').length).to.equal(1);
        expect(element.find('AppBar').length).to.equal(1);

    });

    it('should render navigation in drawer with "Export file" and "Save file" menu item', () => {
        let reducer = new ApplicationStateReducer();
        let element = mount(
            <MuiThemeProvider>
                <Navigation reducer={reducer} />
            </MuiThemeProvider>
        )

        expect(element.find('Drawer').find('MenuItem').length).to.equal(2);
        element.find('Drawer').find('MenuItem').map((item, index) => {
            switch (index) {
                case 0: {
                    expect(item.props()).to.have.property('primaryText', 'Export file');
                    break;
                }
                case 1: {
                    expect(item.props()).to.have.property('primaryText', 'Save file');
                    break;
                }
            }
        })

    });

    it('should render pop up dialog for export with two checkboxes', () => {
        let reducer = new ApplicationStateReducer();
        let element = shallow(
            <ExportDialog reducer={reducer} handleClosePopUpDialog={() => { }} openedPopUpDialog={true} />
        )

        expect(element.find('div').find('Dialog').find('Checkbox').length).to.equal(2);
        //expect(element.find('Dialog').children('actions').length).to.equal(2);

    });

    it('should render pop up dialog for export with two buttons', () => {
        let reducer = new ApplicationStateReducer();
        let element = mount(
            <MuiThemeProvider>
                <ExportDialog reducer={reducer} handleClosePopUpDialog={() => { }} openedPopUpDialog={true} />
            </MuiThemeProvider>
        )
        let actions = element.find('div').find('Dialog').first().prop('actions')
        expect(actions[0].props.label).to.equal('Cancel');
        expect(actions[1].props.label).to.equal('Export');

    });

    // it('should call handleExport on Export button click', () => {

    //     let reducer = new ApplicationStateReducer();
    //     // let element = MuiMountWithContext(
    //     //         <ExportDialog reducer={reducer} handleClosePopUpDialog={() => { }} openedPopUpDialog={true} />
    //     // )
    //     let flag = true;
    //     let element = shallow(
    //         //<Navigation reducer={reducer} />
    //              <ExportDialog reducer={reducer} handleClosePopUpDialog={() => { }} openedPopUpDialog={flag} />
    //     )
    //     element.setState({
    //         exportImage: true,
    //         exportTags: false
    //        // sideBarOpen: true
    //     });
    //     element.update();

    //     let file: Buffer = fs.readFileSync('./test/client/mocks/CT1_UNC.explicit_big_endian.dcm');

    //     let fileArray: FileContent = {
    //         buffer: file,
    //         fileName: 'testFile',
    //         fileSize: 532480
    //     };

    //     let fileService = new FileService(reducer);
    //     let heavyWeightFile = fileService.createHeavyFile(fileArray);


    //     reducer.updateCurrentFile(heavyWeightFile);

    //     let actions = element.find('div').find('Dialog').first().prop('actions');
    //     // console.log(element.find('div').find('Dialog').simulate('click'));
    //     actions[1].props.onTouchTap();
    //     //actions[1].simulate('click');
    //    // console.log(element.find('button').props());

    //     expect(element.state().exportImage).to.equal(false);
    //     expect(element.state().exportTags).to.equal(false);
   
    // });

    it('export dialog should receive props and properly update state', () => {
        // let reducer = new ApplicationStateReducer();
        let file: Buffer = fs.readFileSync('./test/client/mocks/CT1_UNC.explicit_big_endian.dcm');
        let reducer = new ApplicationStateReducer();

        let fileArray: FileContent = {
            buffer: file,
            fileName: 'CT1_UNC.explicit_big_endian',
            fileSize: 532480
        };

        let fileService = new FileService(reducer);
        let heavyWeightFile = fileService.createHeavyFile(fileArray);


        reducer.addLoadedFiles([heavyWeightFile]);
        reducer.addSelectedFile('CT1_UNC.explicit_big_endian', '#000000');
        var flag = true;
        
        let element = MuiMountWithContext(

            <ExportDialog reducer={reducer} handleClosePopUpDialog={() => { }} openedPopUpDialog={flag} />

        )

        element.update();
        expect(element.state().hasImage).to.equal(containsImage(heavyWeightFile.dicomData));
        expect(element.state().multiframe).to.equal(isMultiframe(heavyWeightFile.dicomData));
    });
});