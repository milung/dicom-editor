import * as React from 'react';
import { List, ListItem } from 'material-ui';
import { LightweightFile }  from '../../model/file-interfaces';
import { ApplicationStateReducer } from '../../application-state';
import { ColorDictionary } from '../../utils/colour-dictionary';

interface RecentFilesTabProps {
    recentFiles: LightweightFile[];
    reducer: ApplicationStateReducer;
    colorDictionary: ColorDictionary;
}

interface RecentFilesTabState {

}

export default class RecentFilesTab extends React.Component<RecentFilesTabProps, RecentFilesTabState> {
    constructor(props: RecentFilesTabProps) {
        super(props);

        this.selectCurrentFileFromRecentFile = this.selectCurrentFileFromRecentFile.bind(this);
    }

    render() {
        return (
            <List>
                {this.props.recentFiles.map((item, index) => (
                    <ListItem
                        key={index}
                        onClick={() => this.selectCurrentFileFromRecentFile(item)}
                        primaryText={item.fileName}
                    />
                ))}
            </List>
        );
    }

    private selectCurrentFileFromRecentFile(file: LightweightFile) {
        this.props.reducer.removeAllSelectedFiles();
        this.props.reducer.setComparisonActive(false);
        this.props.colorDictionary.reset();
        this.props.reducer.updateCurrentFromRecentFile(file);
    }
}