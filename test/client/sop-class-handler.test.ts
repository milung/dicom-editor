import { NOT_FOUND_SOP } from './../../src/client/utils/sop-class-handler';
import { expect } from 'chai';
import { getModuleNamesForSopClass, moduleNameBelongsToSopClass } from '../../src/client/utils/sop-class-handler';

describe('SopClassHandler -> getModuleNamesForSopClass()', () => {
    it('should get module names for sop class', () => {
        let expectedModules = [
            'Patient',
            'Clinical Trial Subject',
            'General Study',
            'Patient Study',
            'Clinical Trial Study',
            'General Series',
            'CR Series',
            'Clinical Trial Series',
            'General Equipment',
            'General Image',
            'Image Pixel',
            'Contrast/Bolus',
            'Display Shutter',
            'Device',
            'Specimen',
            'CR Image',
            'Overlay Plane',
            'Modality LUT',
            'VOILUT',
            'SOP Common',
            'Common Instance Reference'
        ];
        let actualModules = getModuleNamesForSopClass('1.2.840.10008.5.1.4.1.1.1');
        expect(actualModules).to.deep.equal(expectedModules);
    });

    it('should get NOT_FOUND_SOP message when cannot find module', () => {
        let expectedModules = [NOT_FOUND_SOP];
        let actualModules = getModuleNamesForSopClass('NON existing');
        expect(actualModules).to.deep.equal(expectedModules);
    });
});

describe('SopClassHandler -> moduleNameBelongsToSopClass()', () => {
    it('should decide that module belongs to sop class', () => {
        expect(moduleNameBelongsToSopClass('Patient', '1.2.840.10008.5.1.4.1.1.1')).to.equal(true);
    });

    it('should decide that module does not belong to sop class', () => {
        expect(moduleNameBelongsToSopClass('DOES NOT BELONG', '1.2.840.10008.5.1.4.1.1.1')).to.equal(false);
    });

    it('should decide that module does not belong to non existing sop class', () => {
        expect(moduleNameBelongsToSopClass('Patient', 'SOP THAT DOES NOT EXIST')).to.equal(false);
    });
});