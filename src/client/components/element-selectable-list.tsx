import * as React from 'react';
import { FileInterface } from '../model/file-interfaces';
import { ListItem, Checkbox } from 'material-ui';
import './element-selectable-list.css';

interface ElementOfSelectableListProps {
    selectFunction: Function;
    item: FileInterface;
}

interface ElementOfSelectableListState {

}

export class ElementOfSelectableList extends 
        React.Component<ElementOfSelectableListProps, ElementOfSelectableListState> {
    constructor(props: ElementOfSelectableListProps) {
        super(props);
    }

    render() {
        return (
            <div className="containera">
                <div className="checkbox">
                    <Checkbox/>
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