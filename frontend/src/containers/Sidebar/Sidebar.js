import React, { Component } from 'react';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/chatroom';
import uuid4 from 'uuid4'
import { Spring } from 'react-spring/renderprops';
import Confirm from '../../components/Confirm/Confirm';
import Modal from '../../components/Modal/Modal';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedChannel: '',
            showDeleteBox: false
        }

        this.socket = this.props.socketChat;

        this.switchChannel = async (id, name) => {

            await this.setState({ selectedChannel: id });
            let data = {
                channelID: id,
                roomID: this.props.roomID,
                username: this.props.username
            }

            await this.props.changeChannel(id, name);
            await this.props.getChatMessages(data);
            await this.socket.emit('JOIN_CHANNEL', {
                room: id,
                name: this.props.username
            })
        }
    }

    addChannel = async () => {
        const name = await prompt();

        if (name === "" || name === null) {
            return;
        }

        let data = {
            username: this.props.username,
            id: this.props.roomID,
            channelID: uuid4(),
            name: name
        }

        await this.props.newChannel(data);

    }

    deleteRoomHandler = () => {
        this.setState({ showDeleteBox: true })
    }

    deleteRoom = async (id, username) => {

        const data = {
            id: id,
            username: username
        }

        await this.props.deleteRoom(data);

    }


    currentChannelStyle = (index) => {
        const isSelected = this.props.channelID === index;
        return isSelected ? styles.ChannelSelected : styles.Channel
    }

    currentChannelDisable = (index) => {
        const isSelected = this.props.channelID === index;
        return isSelected ? true : false;
    }

    hideDeleteBox = () => {
        this.setState({ showDeleteBox: false })
    }


    render() {

        let channels = this.props.channels.map(el => {
            return <div style={{ color: "white" }} key={el.id} className={styles.ChannelWrapper}>
                <button
                    onClick={() => this.switchChannel(el.id, el.name)}
                    disabled={this.currentChannelDisable(el.id)}
                    className={this.currentChannelStyle(el.id)}
                >{"# " + el.name}</button>
            </div>
        });

        let roomOptions = this.props.showOptions &&
            <Spring
                config={{
                    duration: 150
                }}
                from={{
                    height: 0
                }}
                to={{
                    height: 80
                }}>
                {props => (
                    <div className={styles.Options} style={props}>
                        <div className={styles.OptionsBtn}>
                            <div className={styles.IconsWrapper}>
                                <i className="fas fa-user-plus "></i>
                            </div>
                            <div className={styles.OptionsDescription}>
                                Invite people
                            </div>
                        </div>
                        <div className={styles.OptionsBtnRed} onClick={this.deleteRoomHandler}>
                            <div className={styles.IconsWrapper}>
                                <i className="fas fa-trash-alt "></i>
                            </div>
                            <div className={styles.OptionsDescription}>
                                Delete room
                            </div>

                        </div>
                    </div>
                )}


            </Spring>;




        return (
            <React.Fragment>
                {this.state.showDeleteBox ?
                    <div>
                        <Modal onclick={this.hideDeleteBox} />
                        <Confirm
                            cancel={this.hideDeleteBox}
                            confirm={() => this.deleteRoom(this.props.roomID, this.props.username)}
                        />
                    </div> : null}
                <div className={styles.Sidebar}>
                    {roomOptions}

                    <div className={styles.Channels}>
                        <div className={styles.ChannelsHeader}>
                            <h3 className={styles.ChannelTitle}>Channels</h3>
                            <button onClick={this.addChannel} className={styles.AddChannel}>+</button>
                        </div>
                        {channels}

                    </div>
                </div>
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        chatRooms: state.chat.chatRooms,
        username: state.auth.username,
        socketChat: state.auth.socket,
        roomID: state.chat.roomID,
        channels: state.chat.channels,
        roomName: state.chat.roomName,
        showOptions: state.chat.showRoomOptions,
        channelID: state.chat.channelID
    }

}

export default connect(mapStateToProps, actions)(Sidebar);