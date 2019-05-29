import React, { Component } from 'react';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/chatroom';
import uuid4 from 'uuid4'

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedChannel: '',
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
            await this.socket.emit('SWITCH_ROOMS', {
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

    deleteRoom = async (id, username) => {

        const data = {
            id: id,
            username: username
        }

        await this.props.deleteRoom(data);

        this.setState({ chatRooms: this.props.chatRooms });

    }


    currentChannelStyle = (index) => {
        const isSelected = this.state.selectedChannel === index;
        return isSelected ? "red" : "black";
    }

    currentChannelDisable = (index) => {
        const isSelected = this.state.selectedChannel === index;
        return isSelected ? true : false;
    }


    render() {

        let channels = this.props.channels.map(el => {
            return <div style={{ color: "white" }} key={el.id}>
                <button
                    style={{ color: this.currentChannelStyle(el.id) }}
                    onClick={() => this.switchChannel(el.id, el.name)}
                    disabled={this.currentChannelDisable(el.id)}
                >{el.name}</button>
            </div>
        })


        return (
            <div className={styles.Sidebar}>
                <button onClick={this.joinRoom}>JOIN ROOM</button>
                <button onClick={this.addChannel}>NEW CHANNEL</button>
                {channels}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        chatRooms: state.chat.chatRooms,
        username: state.auth.username,
        socketChat: state.auth.socket,
        roomID: state.chat.roomID,
        channels: state.chat.channels
    }

}

export default connect(mapStateToProps, actions)(Sidebar);