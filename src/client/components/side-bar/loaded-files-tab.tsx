import * as React from 'react';
import { RaisedButton, List } from 'material-ui';
import { ElementOfSelectableList } from './element-selectable-list';
import { HeavyweightFile, SelectedFile } from '../../model/file-interfaces';
import { ApplicationStateReducer } from '../../application-state';
import { ColorDictionary } from '../../utils/colour-dictionary';
import './side-bar.css';

interface LoadedFilesTabProps {
    reducer: ApplicationStateReducer;
    loadedFiles: HeavyweightFile[];
    selectedFiles: SelectedFile[];
    colorDictionary: ColorDictionary;
    className: string;
}

interface LoadedFilesTabState {
    checkedCheckboxes: number;
}

export default class LoadedFilesTab extends React.Component<LoadedFilesTabProps, LoadedFilesTabState> {

    constructor(props: LoadedFilesTabProps) {
        super(props);
        this.state = { checkedCheckboxes: 0 };

        this.changeNumberOfCheckedBoxes = this.changeNumberOfCheckedBoxes.bind(this);
        this.getColor = this.getColor.bind(this);
        this.handleCompareClick = this.handleCompareClick.bind(this);
        this.isChecked = this.isChecked.bind(this);
        this.selectCurrentFile = this.selectCurrentFile.bind(this);
    }

    public componentDidMount() {
        this.setState({
            checkedCheckboxes: this.props.selectedFiles.length === 0 ? 0 : this.state.checkedCheckboxes
        });
    }

    render() {
        return (
            <div className={this.props.className}>
                <List style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                    {this.props.loadedFiles.map((item, index) => {
                        const checked = this.isChecked(item);
                        const color = this.getColor(item);

                        return (
                            <ElementOfSelectableList
                                reducer={this.props.reducer}
                                key={index}
                                item={item}
                                selectFunction={this.selectCurrentFile}
                                colorDictionary={this.props.colorDictionary}
                                checked={checked}
                                color={color}
                                checkInform={this.changeNumberOfCheckedBoxes}
                                checkBoxDisabled={this.state.checkedCheckboxes === 2 ? true : false}
                            />
                        );
                    })}
                </List>
                <RaisedButton
                    className="compare-button"
                    label="Compare files"
                    onClick={this.handleCompareClick}
                    primary={true}
                    disabled={this.props.selectedFiles.length === 2 ? false : true}
                />
            </div>
        );
    }

    public handleCompareClick(event: object) {
        this.props.reducer.setComparisonActive(true);
    }

    private isChecked(file: HeavyweightFile) {
        const ll = this.props.selectedFiles.length;
        for (let i = 0; i < ll; i++) {
            const item = this.props.selectedFiles[i];
            if (item.selectedFile.fileName === file.fileName) {
                return true;
            }
        }
        return false;
    }

    private getColor(file: HeavyweightFile) {
        const ll = this.props.selectedFiles.length;
        for (let i = 0; i < ll; i++) {
            const item = this.props.selectedFiles[i];
            if (item.selectedFile.fileName === file.fileName) {
                return item.colour;
            }
        }
        return 'black';
    }

    private selectCurrentFile(file: HeavyweightFile) {
        this.props.reducer.removeAllSelectedFiles();
        this.props.reducer.setComparisonActive(false);
        this.props.colorDictionary.reset();
        this.props.reducer.updateCurrentFile(file);
        this.setState({
            checkedCheckboxes: 0
        });
    }

    private changeNumberOfCheckedBoxes(addition: boolean) {
        if (addition) {
            this.setState({ checkedCheckboxes: this.state.checkedCheckboxes + 1 });
        } else {
            this.setState({ checkedCheckboxes: this.state.checkedCheckboxes - 1 });
        }
    }
}