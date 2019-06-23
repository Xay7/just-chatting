import React, { Component } from 'react';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import Radium from 'radium';
import Channels from '../Channels/Channels'
import {
    clearFetchMessage,
} from '../../store/actions/index';
import UserSettings from '../UserSettings/UserSettings';
import RoomSettings from '../RoomSettings/RoomSettings';
import Tooltip from '../../components/Tooltip/Tooltip';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserSettings: false,
        }
        this.socket = this.props.socketChat;
    }

    showUserSettings = (e) => {
        this.props.clearFetchMessage();
        this.setState({ showUserSettings: !this.state.showUserSettings })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.showUserSettings && <UserSettings toggleDisplay={this.showUserSettings} />}
                <div className={styles.Sidebar}>
                    {this.props.showOptions && <RoomSettings />}
                    {this.props.roomID && <Channels />}
                    <div className={styles.User}>
                        <img src={this.props.avatar} alt={this.props.username + " avatar"} className={styles.Avatar} />
                        <p style={{ color: 'white' }}>{this.props.username}</p>
                        <Tooltip where="Top" distance="-35px" text="User settings" wrapper="Right" height="auto" width="50px" margin="0 5px 0 0" position="absolute">
                            <i
                                className="fas fa-cog fa-lg"
                                style={{
                                    color: "white",
                                    ':hover': {
                                        color: '#BBB',
                                        cursor: 'pointer'
                                    },
                                }}
                                onClick={this.showUserSettings}></i>
                        </Tooltip>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        roomID: state.chat.roomID,
        showOptions: state.chat.showRoomOptions,
        avatar: state.auth.avatar,
    }
}

const mapDispatchToProps = {
    clearFetchMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Sidebar));