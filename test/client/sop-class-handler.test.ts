// import { NOT_FOUND_SOP } from './../../src/client/utils/sop-class-handler';
// import { expect } from 'chai';
// import { getModuleNamesForSopClass, moduleNameBelongsToSopClass } from '../../src/client/utils/sop-class-handler';

// describe('SopClassHandler -> getModuleNamesForSopClass()', () => {
//     it('should get module names for sop class', () => {
//         let expectedModules = ['TEST MODULE 1', 'TEST MODULE 2'];
//         let actualModules = getModuleNamesForSopClass('TEST SOP CLASS');
//         expect(actualModules).to.deep.equal(expectedModules);
//     });

//     it('should get NOT_FOUND_SOP message when cannot find module', () => {
//         let expectedModules = [NOT_FOUND_SOP];
//         let actualModules = getModuleNamesForSopClass('NON existing');
//         expect(actualModules).to.deep.equal(expectedModules);
//     });
// });

// describe('SopClassHandler -> moduleNameBelongsToSopClass()', () => {
//     it('should decide that module belongs to sop class', () => {
//         expect(moduleNameBelongsToSopClass('TEST MODULE 1', 'TEST SOP CLASS')).to.equal(true);
//     });

//     it('should decide that module does not belong to sop class', () => {
//         expect(moduleNameBelongsToSopClass('DOES NOT BELONG', 'TEST SOP CLASS')).to.equal(false);
//     });

//     it('should decide that module does not belong to non existing sop class', () => {
//         expect(moduleNameBelongsToSopClass('TEST MODULE 1', 'SOP THAT DOES NOT EXIST')).to.equal(false);
//     });
// });