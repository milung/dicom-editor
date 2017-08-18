import { LightweightFile, HeavyweightFile } from './../../src/client/model/file-interfaces';
import { ApplicationStateReducer, ApplicationState } from './../../src/client/application-state';
import { expect } from 'chai';

describe('ApplicationStateReducer -> addSavedFile()', () => {
    it('should add saved file into empty state.savedFiles', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().savedFiles).to.deep.equal([]);

        let file: LightweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            dbKey: 'name',
        }
        reducer.addSavedFile(file);
        expect(reducer.getState().savedFiles).to.deep.equal([file]);
    });

    it('should add saved file correctly into not empty state.savedFiles', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().savedFiles).to.deep.equal([]);

        let firstFile: LightweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            dbKey: 'name',
        }

        let secondFile: LightweightFile = {
            fileName: 'name2',
            timestamp: 2,
            dbKey: 'name2',
        }
        reducer.addSavedFile(firstFile);
        reducer.addSavedFile(secondFile);
        expect(reducer.getState().savedFiles).to.deep.equal([firstFile, secondFile]);
    });

    it('should rewrite saved file in not empty state.savedFiles', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().savedFiles).to.deep.equal([]);

        let firstFile: LightweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            dbKey: 'name',
        }

        let secondFile: LightweightFile = {
            fileName: 'name2',
            timestamp: 2,
            dbKey: 'name2',
        }

        let rewriteFile: LightweightFile = {
            fileName: 'name',
            timestamp: 3,
            dbKey: 'name3',
        }
        reducer.addSavedFile(firstFile);
        reducer.addSavedFile(secondFile);
        reducer.addSavedFile(rewriteFile);

        expect(reducer.getState().savedFiles).to.deep.equal([rewriteFile, secondFile]);
    });
});

describe('ApplicationStateReducer -> updateSavedFiles()', () => {
    it('should update empty saved files into empty state.savedFiles', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().savedFiles).to.deep.equal([]);

        reducer.updateSavedFiles([]);
        expect(reducer.getState().savedFiles).to.deep.equal([]);
    });

    it('should update saved files correctly', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().savedFiles).to.deep.equal([]);

        let files: LightweightFile[] = [
            {
                fileName: 'name',
                timestamp: 123456789,
                dbKey: 'name',
            },
            {
                fileName: 'name2',
                timestamp: 2,
                dbKey: 'name2',
            }
        ];

        reducer.updateSavedFiles(files);

        expect(reducer.getState().savedFiles).to.deep.equal(files);
    });
});

describe('ApplicationStateReducer -> addLoadedFiles()', () => {
    it('should add loaded file into empty state.loadedFiles', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().loadedFiles).to.deep.equal([]);
        expect(reducer.getState().currentFile).to.equal(undefined);

        let file: HeavyweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            fileSize: 1,
            bufferedData: new Uint8Array(0),
            dicomData: {
                entries: []
            }
        }
        reducer.addLoadedFiles([file]);
        expect(reducer.getState().loadedFiles).to.deep.equal([file]);
        expect(reducer.getState().currentFile).to.deep.equal(file);
    });

    it('should add multiple files into empty state.loadedFiles', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().loadedFiles).to.deep.equal([]);
        expect(reducer.getState().currentFile).to.equal(undefined);

        let files: HeavyweightFile[] = [
            {
                fileName: 'name',
                timestamp: 123456789,
                fileSize: 1,
                bufferedData: new Uint8Array(0),
                dicomData: {
                    entries: []
                }
            },
            {
                fileName: 'name2',
                timestamp: 2,
                fileSize: 3,
                bufferedData: new Uint8Array(3),
                dicomData: {
                    entries: []
                }
            }
        ]
        reducer.addLoadedFiles(files);
        expect(reducer.getState().loadedFiles).to.deep.equal([files[1], files[0]]);
        expect(reducer.getState().currentFile).to.deep.equal(files[0]);
    });
});

describe('ApplicationStateReducer -> removeLoadedFiles()', () => {
    it('should remove one file from loaded files containing one file', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().loadedFiles).to.deep.equal([]);
        expect(reducer.getState().currentFile).to.equal(undefined);

        let file: HeavyweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            fileSize: 1,
            bufferedData: new Uint8Array(0),
            dicomData: {
                entries: []
            }
        }
        reducer.addLoadedFiles([file]);

        reducer.removeLoadedFiles([file]);
        expect(reducer.getState().loadedFiles.length).to.equal(0);
        expect(reducer.getState().currentFile).to.equal(undefined);

    });

    it('should not crash when removing empty array from loaded files', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().loadedFiles).to.deep.equal([]);
        expect(reducer.getState().currentFile).to.equal(undefined);

        reducer.removeLoadedFiles([]);
        expect(reducer.getState().loadedFiles.length).to.equal(0);
        expect(reducer.getState().currentFile).to.equal(undefined);

    });

    it('should do nothing when removing empty array from loaded files', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();

        let file: HeavyweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            fileSize: 1,
            bufferedData: new Uint8Array(0),
            dicomData: {
                entries: []
            }
        }
        reducer.addLoadedFiles([file]);

        reducer.removeLoadedFiles([]);
        expect(reducer.getState().loadedFiles.length).to.equal(1);
        expect(reducer.getState().loadedFiles).to.deep.equal([file]);
        expect(reducer.getState().currentFile).to.deep.equal(file);

    });

    it('should remove loaded file and select current file correctly ', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();

        let files: HeavyweightFile[] = [
            {
                fileName: 'name',
                timestamp: 123456789,
                fileSize: 1,
                bufferedData: new Uint8Array(0),
                dicomData: {
                    entries: []
                }
            },
            {
                fileName: 'name2',
                timestamp: 2,
                fileSize: 3,
                bufferedData: new Uint8Array(3),
                dicomData: {
                    entries: []
                }
            }
        ]
        reducer.addLoadedFiles(files);

        reducer.removeLoadedFiles([files[0]]);

        expect(reducer.getState().loadedFiles.length).to.equal(1);
        expect(reducer.getState().currentFile).to.deep.equal(files[1]);
        expect(reducer.getState().loadedFiles[0]).to.deep.equal(files[1]);
    });
});

describe('ApplicationStateReducer -> getState()', () => {
    it('should get initial state', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        let state = reducer.getState();

        let expectedState: ApplicationState = {
            curentExportFileNumber: 0,
            recentFiles: [],
            loadedFiles: [],
            currentFile: undefined,
            currentIndex: undefined,
            selectedFiles: [],
            comparisonActive: false,
            savedFiles: [],
            searchExpression: ''
        }
        expect(state).to.deep.equal(expectedState);
    });

    it('should get non empty state', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();

        let firstFile: LightweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            dbKey: 'name',
        }

        let secondFile: LightweightFile = {
            fileName: 'name2',
            timestamp: 2,
            dbKey: 'name2',
        }

        reducer.addSavedFile(firstFile);
        reducer.addSavedFile(secondFile);

        let files: HeavyweightFile[] = [
            {
                fileName: 'name',
                timestamp: 123456789,
                fileSize: 1,
                bufferedData: new Uint8Array(0),
                dicomData: {
                    entries: []
                }
            },
            {
                fileName: 'name2',
                timestamp: 2,
                fileSize: 3,
                bufferedData: new Uint8Array(3),
                dicomData: {
                    entries: []
                }
            }
        ]
        reducer.addLoadedFiles(files);

        let expectedState: ApplicationState = {
            curentExportFileNumber: 0,
            recentFiles: [],
            loadedFiles: [files[1], files[0]],
            selectedFiles: [],
            comparisonActive: false,
            savedFiles: [
                firstFile,
                secondFile
            ],
            searchExpression: '',
            currentFile: files[0],
            currentIndex: 1,
        }

        let state = reducer.getState();
        expect(state).to.deep.equal(expectedState);
    });
});

describe('ApplicationStateReducer -> removeRecentFile()', () => {
    it('should not crash when removing file from empty array ', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().recentFiles).to.deep.equal([]);

        reducer.removeRecentFile(5);
        expect(reducer.getState().recentFiles).to.deep.equal([]);
    });

    it('should remove correctly recent file', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().recentFiles).to.deep.equal([]);

        let firstFile: LightweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            dbKey: 'name',
        }

        let secondFile: LightweightFile = {
            fileName: 'name2',
            timestamp: 2,
            dbKey: 'name2',
        }
        reducer.updateRecentFiles([firstFile, secondFile]);

        reducer.removeRecentFile(0);
        expect(reducer.getState().recentFiles).to.deep.equal([secondFile]);

        reducer.removeRecentFile(0);
        expect(reducer.getState().recentFiles).to.deep.equal([]);
    });

    it('should remove correctly recent file', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().recentFiles).to.deep.equal([]);

        let firstFile: LightweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            dbKey: 'name',
        }

        let secondFile: LightweightFile = {
            fileName: 'name2',
            timestamp: 2,
            dbKey: 'name2',
        }
        reducer.updateRecentFiles([firstFile, secondFile]);

        reducer.removeRecentFile(1);
        expect(reducer.getState().recentFiles).to.deep.equal([firstFile]);

        reducer.removeRecentFile(0);
        expect(reducer.getState().recentFiles).to.deep.equal([]);
    });

});

describe('ApplicationStateReducer -> updateRecentFiles()', () => {
    it('should update empty array correctly ', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().recentFiles).to.deep.equal([]);

        reducer.updateRecentFiles([]);
        expect(reducer.getState().recentFiles).to.deep.equal([]);
    });

    it('should update recent files', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().recentFiles).to.deep.equal([]);

        let firstFile: LightweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            dbKey: 'name',
        }

        let secondFile: LightweightFile = {
            fileName: 'name2',
            timestamp: 2,
            dbKey: 'name2',
        }
        reducer.updateRecentFiles([firstFile, secondFile]);
        expect(reducer.getState().recentFiles).to.deep.equal([firstFile, secondFile]);
    });

});

describe('ApplicationStateReducer -> updateCurrentFile()', () => {
    it('should update current file ', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().currentFile).to.deep.equal(undefined);

        let file: HeavyweightFile = {
            fileName: 'name',
            timestamp: 123456789,
            fileSize: 1,
            bufferedData: new Uint8Array(0),
            dicomData: {
                entries: []
            }
        }

        reducer.updateCurrentFile(file);
        expect(reducer.getState().currentFile).to.deep.equal(file);
    });

});

describe('ApplicationStateReducer -> setComparisonActive()', () => {
    it('should set comparison active accordingly', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().comparisonActive).to.equal(false);

        reducer.setComparisonActive(true);
        expect(reducer.getState().comparisonActive).to.equal(true);

        reducer.setComparisonActive(true);
        expect(reducer.getState().comparisonActive).to.equal(true);

        reducer.setComparisonActive(false);
        expect(reducer.getState().comparisonActive).to.equal(false);
    });

});

describe('ApplicationStateReducer -> addSelectedFile()', () => {
    it('should add selected file', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        let file: HeavyweightFile =
            {
                fileName: 'name2',
                timestamp: 2,
                fileSize: 3,
                bufferedData: new Uint8Array(3),
                dicomData: {
                    entries: []
                }
            }

        reducer.addLoadedFiles([file]);

        reducer.addSelectedFile('name2', 'red');
        expect(reducer.getState().selectedFiles).to.deep.equal(
            [
                {
                    selectedFile: file,
                    colour: 'red'
                }
            ]
        );
    });

});

describe('ApplicationStateReducer -> removeSelectedFile()', () => {
    it('should remove selected file', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        let file: HeavyweightFile =
            {
                fileName: 'name2',
                timestamp: 2,
                fileSize: 3,
                bufferedData: new Uint8Array(3),
                dicomData: {
                    entries: []
                }
            }

        reducer.addLoadedFiles([file]);

        reducer.addSelectedFile('name2', 'red');

        reducer.removeSelectedFile('name2');
        expect(reducer.getState().selectedFiles).to.deep.equal([]);
    });

});

describe('ApplicationStateReducer -> removeAllSelectedFiles()', () => {
    it('should remove all selected files from empty array wihout crashing', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();
        expect(reducer.getState().selectedFiles).to.deep.equal([]);

        reducer.removeAllSelectedFiles();
        expect(reducer.getState().selectedFiles).to.deep.equal([]);
    });

});

describe('ApplicationStateReducer -> setSearchExpression()', () => {
    it('should set search expression', () => {
        let reducer: ApplicationStateReducer = new ApplicationStateReducer();

        reducer.setSearchExpression('exp');
        expect(reducer.getState().searchExpression).to.equal('exp');
    });

});