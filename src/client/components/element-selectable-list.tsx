import * as React from 'react';
import { FileInterface } from '../model/file-interfaces';
import { ListItem, Checkbox } from 'material-ui';
import './element-selectable-list.css';

interface ElementOfSelectableListProps {
    selectFunction: Function;
    item: FileInterface;
    index: number;
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
            <tr>
                <td className="checkbox">
                    <Checkbox />
                </td>
                <td className="td">
                    <ListItem
                        onClick={() => this.props.selectFunction(this.props.item)}
                        key={this.props.index}
                        value={this.props.item}
                        primaryText={this.props.item.fileName}
                    />
                </td>
            </tr>
        );
    }
}