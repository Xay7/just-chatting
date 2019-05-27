import React, { Component } from 'react';
import styles from './RoomHelpers.module.scss';
import { connect } from 'react-redux';

class RoomHelpers extends Component {
    render() {
        return (
            <div className={styles.RoomHelpers}>
                <div className={styles.Room}>
                    <h2 className={styles.RoomName}>{this.props.roomName}</h2>
                    <button className={styles.RoomSettings}>OPTIONS</button>
                </div>
                <div className={styles.Channel}>
                    <h2 className={styles.ChannelName}>{this.props.channelName}</h2>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        roomName: state.chat.roomName,
        channelName: state.chat.channelName
    }
}

export default connect(mapStateToProps)(RoomHelpers);