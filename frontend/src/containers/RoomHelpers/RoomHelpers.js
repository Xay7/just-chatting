import React, { Component } from 'react';
import styles from './RoomHelpers.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/chatroom';
class RoomHelpers extends Component {
    render() {
        return (
            <React.Fragment>
                <div className={styles.RoomHelpers} >
                    <div className={styles.Room} onClick={this.props.showRoomOptions}>
                        <h2 className={styles.RoomName}>{this.props.roomName}</h2>
                        <i
                            className="fas fa-caret-down fa-lg"
                            style={{
                                color: "white",
                                marginRight: '22px'
                            }}></i>
                    </div>
                    <div className={styles.Channel}>
                        <h2 className={styles.ChannelName}>{this.props.channelName}</h2>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        roomName: state.chat.roomName,
        channelName: state.chat.channelName
    }
}

export default connect(mapStateToProps, actions)(RoomHelpers);