import * as React from 'react';
import { List, ListItem, RaisedButton } from 'material-ui';
import './pallete-button-menu.css';
import { NavigationArrowDropUp, NavigationArrowDropDown } from 'material-ui/svg-icons';

export interface PalleteItem {
    text: string;
    icon: JSX.Element;
    onClick: () => void;
    disabled: boolean;
}

export interface PalleteButtonMenuProps {
    items: PalleteItem[];
    currentAction?: PalleteItem;
    storeCurrentAction: Function;
}

export interface PalleteButtonMenuState {
    open: boolean;
    currentAction?: PalleteItem;
}

export class PalleteButtonMenu extends React.Component<PalleteButtonMenuProps, PalleteButtonMenuState> {
    public constructor(props: PalleteButtonMenuProps) {
        super(props);

        this.state = {
            open: false
        };

        this.handleMainClick = this.handleMainClick.bind(this);
    }

    public render() {
        let currentAction: PalleteItem | undefined = this.state.currentAction;
        let arrowElement = (
            <div
                className="pallete-arrow-button"
                onClick={() => { this.setState({ open: !this.state.open }); }}
            >
                {this.state.open
                    ? (<NavigationArrowDropDown className="pallete-arrow-self" />)
                    : (<NavigationArrowDropUp className="pallete-arrow-self" />)}
            </div>
        );

        if (!currentAction) {
            currentAction = {
                text: 'Select action...',
                onClick: Function,
                icon: (<div />),
                disabled: false
            };
        }
        return (
            <div>
                <div
                    hidden={!this.state.open}
                    className="pallete-tools-container"
                >
                    <List>
                        {this.props.items.map((item, index) => (
                            <ListItem
                                style={item.disabled ? { color: 'gray', cursor: 'not-allowed' } : { color: 'black' }}
                                key={index}
                                onClick={() => this.handleItemClick(item)}
                                primaryText={item.text}
                                leftIcon={item.icon}
                                disabled={item.disabled}
                            />
                        ))}
                    </List>
                </div>

                <div className="pallete-buttons-container">
                    <RaisedButton
                        className="pallete-menu-button"
                        label={currentAction.text}
                        onClick={this.handleMainClick}
                        primary={true}
                        disabled={currentAction.disabled}
                    />

                    {arrowElement}

                </div>
            </div>
        );
    }

    public componentWillReceiveProps(nextProps:  PalleteButtonMenuProps) {
        if (nextProps.currentAction) {
            this.setState({
                currentAction: nextProps.currentAction
            });
        }
    }

    private handleMainClick() {
        if (this.state.currentAction) {
            this.state.currentAction.onClick();
        } else {
            this.setState({
                open: !this.state.open
            });
        }
    }

    private handleItemClick(item: PalleteItem) {
        if (!item.disabled) {
            this.setState({
                currentAction: item,
                open: false
            });
            this.props.storeCurrentAction(item);
            item.onClick();
        }

    }
}