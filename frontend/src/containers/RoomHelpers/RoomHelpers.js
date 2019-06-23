import React, { Component } from 'react';
import styles from './RoomHelpers.module.scss';
import { connect } from 'react-redux';
import { showRoomOptions, clearFetchMessage } from '../../store/actions/index';
import Radium from 'radium';
import ChannelSettings from '../ChannelSettings/ChannelSettings';
import Tooltip from '../../components/Tooltip/Tooltip';

class RoomHelpers extends Component {

    state = {
        showChannelSettings: false,
        channelName: '',
        channelDescription: ''
    }


    showOptionsHandler = () => {

        if (this.props.roomName === '') {
            return;
        }

        this.props.showRoomOptions()
    }

    showChannelSettings = () => {
        this.props.clearFetchMessage();
        this.setState({ showChannelSettings: !this.state.showChannelSettings })
    }

    render() {
        return (
            <React.Fragment>
                {!this.props.roomID ? null :
                    <React.Fragment>
                        {this.state.showChannelSettings && <ChannelSettings display={this.showChannelSettings} />}
                        <div className={styles.RoomHelpers} >
                            <div className={styles.Room} onClick={this.showOptionsHandler}>
                                <h2 className={styles.RoomName}>{this.props.roomName}</h2>
                                {this.props.roomID && <i
                                    className="fas fa-caret-down fa-lg"
                                    style={{
                                        color: "white",
                                        marginRight: '22px'
                                    }}></i>}

                            </div>
                            {this.props.channels.length === 0 ? null :
                                <div className={styles.Channel}>
                                    <h2 className={styles.ChannelName}>{this.props.channelName}</h2>
                                    <p className={styles.ChannelDescription}>{this.props.channelDescription}</p>
                                    {this.props.user_id === this.props.owner_id &&
                                        <Tooltip where="Left" distance="-105px" wrapper="Right" text="Channel settings" height="50px" width="50px" margin="0 0 0px 0" position="absolute">
                                            <i
                                                className="fas fa-cog fa-lg"
                                                style={{
                                                    position: "absolute",
                                                    right: "0",
                                                    marginRight: "20px",
                                                    color: "#444444",
                                                    ':hover': {
                                                        color: '#BBB',
                                                        cursor: 'pointer'
                                                    },
                                                }}
                                                onClick={this.showChannelSettings}></i>
                                        </Tooltip>

                                    }
                                </div>
                            }
                        </div>
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        roomName: state.chat.roomName,
        user_id: state.auth.user_id,
        owner_id: state.chat.roomOwner.id,
        roomID: state.chat.roomID,
        channels: state.chat.channels,
        channelDescription: state.chat.channelDescription,
        errorMessage: state.chat.errorMessage,
        successMessage: state.chat.successMessage,
        channelName: state.chat.channelName
    }
}


const mapDispatchToProps = {
    showRoomOptions,
    clearFetchMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(RoomHelpers));