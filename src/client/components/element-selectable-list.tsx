import * as React from 'react';
import { FileInterface } from '../model/file-interfaces';
import { ListItem, Checkbox } from 'material-ui';
import { ApplicationStateReducer } from '../application-state';
import './element-selectable-list.css';

interface ElementOfSelectableListProps {
    reducer: ApplicationStateReducer;
    selectFunction: Function;
    item: FileInterface;
}

interface ElementOfSelectableListState {
    activeCheckboxes: number[];
}

export class ElementOfSelectableList extends
    React.Component<ElementOfSelectableListProps, ElementOfSelectableListState> {

    constructor(props: ElementOfSelectableListProps) {
        super(props);
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck(e: object, isInputChecked: boolean) {
        if (isInputChecked) {
            this.props.reducer.addSelectedFile(this.props.item.fileName);
        } else {
            this.props.reducer.removeSelectedFile(this.props.item.fileName);
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
                    />
                </div>
            </div>
        );
    }
}