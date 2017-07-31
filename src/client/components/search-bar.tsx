
import * as React from 'react';
import { RaisedButton } from 'material-ui';
import './search-bar.css';
import TextField from 'material-ui/TextField';
import { ApplicationStateReducer } from '../application-state';

interface SearchBarState {
    searchingValue: string;
}

interface SearchBarProps {
    reducer: ApplicationStateReducer;
}

export default class Search extends React.Component<SearchBarProps, SearchBarState> {
    public constructor(props: SearchBarProps) {
        super(props);
        this.state = {
            searchingValue: ''
        };
    }

    setSearching = () => {
        var value = this.state.searchingValue;
        this.props.reducer.setSearchExpression(value);
    }

    render() {
        return (
            <div className="flex-container">
                <TextField
                    className="textField-override"
                    hintText="Text to find"
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            { this.setSearching(); }
                            ev.preventDefault();
                        }
                    }}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        this.setState({ searchingValue: e.currentTarget.value })}
                />
                <RaisedButton
                    primary={true}
                    label="Find"
                    onClick={this.setSearching}
                    className="raisedButton-override"
                />
            </div>
        );
    }
}