import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

export interface Props {

}

export interface State {

}

const styles = {
    largeIcon: {
        marginTop: -10,
        height: 60,
    },
};

export default class UI extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <div>
                <AppBar
                    title={<span>Dicom Viewer</span>}
                    iconElementLeft={<IconButton iconStyle={styles.largeIcon} style={styles.largeIcon} disabled={true}>
                        <img src="./images/logo-small-white.png" alt="Dicom Viewer" /></IconButton>} 
                    iconElementRight={<FlatButton label="Image" />}
                />
            </div>
        );
    }
}