import * as React from 'react';
import { FileInterface } from '../model/file-interfaces';
import { ListItem, Checkbox } from 'material-ui';
import { ApplicationStateReducer } from '../application-state';
import './element-selectable-list.css';
import { ColorDictionary } from '../utils/colour-dictionary';

interface ElementOfSelectableListProps {
    reducer: ApplicationStateReducer;
    selectFunction: Function;
    item: FileInterface;
    colorDictionary: ColorDictionary;
}

interface ElementOfSelectableListState {
    currentColor: string;
}

export class ElementOfSelectableList extends
    React.Component<ElementOfSelectableListProps, ElementOfSelectableListState> {

    constructor(props: ElementOfSelectableListProps) {
        super(props);
        this.handleCheck = this.handleCheck.bind(this);
        this.state = {currentColor: 'black'};
    }

    handleCheck(e: object, isInputChecked: boolean) {
        if (isInputChecked) {
            let newColor = this.props.colorDictionary.getFirstFreeColor();
            this.props.reducer.addSelectedFile(this.props.item.fileName, newColor);
            this.setState({currentColor: newColor});
        } else {
            let freeColor = this.props.reducer.removeSelectedFile(this.props.item.fileName);
            this.props.colorDictionary.freeColor(freeColor);
            this.setState({currentColor: 'black'});
        }
    }

    render() {
        return (
            <div className="containera">
                <div className="checkbox">
                    <Checkbox
                        onCheck={this.handleCheck}
                    />
                </div>
                <div className="td">
                    <ListItem
                        onClick={() => this.props.selectFunction(this.props.item)}
                        primaryText={this.props.item.fileName}
                        style={{color: this.state.currentColor}}
                    />
                </div>
            </div>
        );
    }
}