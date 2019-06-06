import React, { Component } from 'react';
import styles from './RoomHelpers.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/chatroom';
import Radium from 'radium';
import Modal from '../../components/Modal/Modal';
import Options from '../../components/Options/Options';
import ChatInput from '../../components/ChatInput/ChatInput';
import Button from '../../components/Button/Button';

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

    changeChannelSettings = async () => {

        let data = {
            channelName: this.state.channelName,
            channelDescription: this.state.channelDescription,
            channel: this.props.channelID,
            username: this.props.username,
            room: this.props.roomID
        }

        await this.props.changeChannelSettings(data);
    }

    channelNameHandler = (e) => {
        this.setState({ channelName: e.target.value })
    }

    channelDescriptionHandler = (e) => {
        this.setState({ channelDescription: e.target.value })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.showChannelSettings &&
                    <React.Fragment>
                        <Modal onclick={this.showChannelSettings} />
                        <Options>
                            <div className={styles.ChannelSettingsWrapper}>
                                <h3>Edit channel settings</h3>
                                <ChatInput
                                    Type="text"
                                    OnChange={this.channelNameHandler}
                                    Placeholder="New channel name"
                                    ID="channelName"
                                    autoComplete="off"
                                >Room Name</ChatInput>
                                <ChatInput
                                    Type="text"
                                    OnChange={this.channelDescriptionHandler}
                                    Placeholder="New description"
                                    ID="channelDescription"
                                    autoComplete="off"
                                >Room description</ChatInput>
                                {this.props.errorMessage && <p style={{ color: "red" }}>{this.props.errorMessage}</p>}
                                {this.props.successMessage && <p style={{ color: "green" }}>{this.props.successMessage}</p>}
                                <div className={styles.Btns}>

                                    <Button ClassName="Cancel" OnClick={this.showChannelSettings}>Cancel</Button>
                                    <Button ClassName="Confirm" OnClick={this.changeChannelSettings}>Submit</Button>
                                </div>
                                <Button ClassName="Danger" OnClick={this.showAddChannel}>Delete Channel</Button>
                            </div>
                        </Options>
                    </React.Fragment>
                }
                <div className={styles.RoomHelpers} >
                    <div className={styles.Room} onClick={this.showOptionsHandler}>
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
                        <p className={styles.ChannelDescription}>{this.props.channelDescription}</p>
                        <i
                            className="fas fa-cog fa-lg"
                            style={{
                                position: "absolute",
                                right: "0",
                                marginRight: "20px",
                                color: "black",
                                ':hover': {
                                    color: '#BBB',
                                    cursor: 'pointer'
                                },
                            }}
                            onClick={this.showChannelSettings}></i>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        roomName: state.chat.roomName,
        channelName: state.chat.channelName,
        channelDescription: state.chat.channelDescription,
        channelID: state.chat.channelID,
        username: state.auth.username,
        roomID: state.chat.roomID,
        errorMessage: state.chat.errorMessage,
        successMessage: state.chat.successMessage
    }
}

export default connect(mapStateToProps, actions)(Radium(RoomHelpers));