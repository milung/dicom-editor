import * as React from 'react';
import { HeavyweightFile } from '../../model/file-interfaces';
import { ListItem, Checkbox } from 'material-ui';
import { ApplicationStateReducer } from '../../application-state';
import './element-selectable-list.css';
import { ColorDictionary } from '../../utils/colour-dictionary';
var ClearIcon = require('react-icons/lib/md/clear');

interface ElementOfSelectableListProps {
    reducer: ApplicationStateReducer;
    selectFunction: Function;
    item: HeavyweightFile;
    colorDictionary: ColorDictionary;
    checked: boolean;
    color: string;
    checkInform: Function;
    checkBoxDisabled: boolean;
}

interface ElementOfSelectableListState {
    currentColor: string;
}

export class ElementOfSelectableList extends
    React.Component<ElementOfSelectableListProps, ElementOfSelectableListState> {

    constructor(props: ElementOfSelectableListProps) {
        super(props);
        this.handleCheck = this.handleCheck.bind(this);
        this.state = { currentColor: 'black' };
    }

    handleCheck(e: object, isInputChecked: boolean) {
        if (isInputChecked) {
            let newColor = this.props.colorDictionary.getFirstFreeColor();
            this.props.reducer.addSelectedFile(this.props.item.fileName, newColor);
            this.setState({ currentColor: newColor });
            this.props.checkInform(true);
        } else {
            let freeColor = this.props.reducer.removeSelectedFile(this.props.item.fileName);
            this.props.reducer.setComparisonActive(false);
            this.props.colorDictionary.freeColor(freeColor);
            this.setState({ currentColor: 'black' });
            this.props.checkInform(false);
        }
    }

    render() {
        let bckgcolor = this.isCurrentFile() ? { backgroundColor: '#c7d5ed' } : { backgroundColor: 'white' };
        return (
            <div className="container-selectable-list" style={bckgcolor}>
                <div className="checkbox">
                    <Checkbox
                        onCheck={this.handleCheck}
                        checked={this.props.checked}
                        disabled={this.props.checked ? false : this.props.checkBoxDisabled}
                    />
                </div>
                <div className="truncate">
                    <ListItem
                        onClick={() => this.props.selectFunction(this.props.item)}
                        primaryText={this.props.item.fileName}
                        style={{ color: this.props.color || this.state.currentColor }}
                    />
                </div>

                <div className="clear-icon-container">
                    <ClearIcon
                        className="clearIcon"
                        onClick={() => this.props.reducer.removeLoadedFiles([this.props.item])}
                    />
                </div>

            </div>
        );
    }

    private isCurrentFile() {
        if (this.props.reducer.getState().currentFile === this.props.item) {
            return true;
        } else {
            return false;
        }
    }
}