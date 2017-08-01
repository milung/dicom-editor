import * as React from 'react';
import { List, ListItem } from 'material-ui';
import { DicomExtendedComparisonData, DicomComparisonData } from '../../model/dicom-entry';
import './dicom-table.css';
import { sortDicomComparisonEntries } from '../../utils/dicom-entry-converter';
import { DicomSimpleComparisonTable } from './dicom-simple-comparison-table';

interface TableData {
    groups: DicomComparisonData[];
    moduleName: string;
}

interface DicomExtendedComparisonProps {
    data: DicomExtendedComparisonData;
}

interface DicomExtendedComparisonState {
}

export class DicomExtendedComparisonTable extends React.Component<
    DicomExtendedComparisonProps, DicomExtendedComparisonState> {

    constructor(props: DicomExtendedComparisonProps) {
        super(props);
    }

    render() {
        let moduleArray: TableData[] = [];
        
        if (this.props.data) {

            for (var moduleName in this.props.data) {
                if (moduleName) {
                    let data: TableData = {
                        groups: sortDicomComparisonEntries(this.props.data[moduleName]),
                        moduleName: moduleName
                    };
                    moduleArray.push(data);
                }
            }

            moduleArray.sort((elementA: TableData, elementB: TableData) => {
                return elementA.moduleName.localeCompare(elementB.moduleName);
            });
            return (
                <List>
                    {/* iterates over modules */}
                    { moduleArray.map((module, moduleIndex) => {
                        return (
                            <ListItem
                                primaryText={module.moduleName}
                                key={moduleIndex}
                                primaryTogglesNestedList={true}                
                                nestedItems={[
            
                                 <ListItem disabled={true} key={moduleIndex}>
                                     <DicomSimpleComparisonTable comparisonData = {module.groups}/>
                                </ListItem>

                                ]}
                            />
                        );
                    })}
                </List>
            );
        } else {
            return (<div />);
        }
    }
}
