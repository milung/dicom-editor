
import * as React from 'react';
import { RaisedButton } from 'material-ui';
import './search-bar.css';
import TextField from 'material-ui/TextField';
import { ApplicationStateReducer } from '../application-state';
var ClearIcon = require('react-icons/lib/md/clear');

interface SearchBarState {
    searchingValue: string;
    defaultValue: string;
}

interface SearchBarProps {
    reducer: ApplicationStateReducer;
}

export default class Search extends React.Component<SearchBarProps, SearchBarState> {
    public constructor(props: SearchBarProps) {
        super(props);
        this.state = {
            searchingValue: '',
            defaultValue: 'Text to find'
        };
    }

    render() {
        return (
            <div className="flex-container">
                <div className="list-item">
                    <TextField
                        className="textField-override"
                        hintText={this.state.defaultValue}
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                { this.setSearching(); }
                                ev.preventDefault();
                            }
                        }}
                        value={this.state.searchingValue}
                        onChange={(e: React.FormEvent<HTMLInputElement>) =>
                            this.setState({ searchingValue: e.currentTarget.value })}
                    />
                    <ClearIcon onClick={this.removeSearching} className="icon-override" />
                </div>
                <RaisedButton
                    primary={true}
                    label="Find"
                    onClick={this.setSearching}
                    className="raisedButton-override"
                />
            </div>
        );
    }
    
    private setSearching = () => {
        var value = this.state.searchingValue;
        this.props.reducer.setSearchExpression(value);
    }

    private removeSearching = () => {
        this.props.reducer.setSearchExpression('');
        this.setState({
            searchingValue: '',
            defaultValue: 'Text to find'
        });
    }
}