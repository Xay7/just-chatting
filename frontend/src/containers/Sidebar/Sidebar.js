import React, { Component } from 'react';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/chatroom';
import uuid4 from 'uuid4'

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedRoom: '',
            chatRooms: {
                owned: [],
                joined: []
            }
        }

        this.socket = this.props.socketChat;

        this.switchChatroom = async (roomID, roomName, roomChannels) => {
            await this.setState({ selectedRoom: roomID });

            let data = {
                room: roomID,
                username: this.props.username,
                roomName: roomName,
                roomChannels: roomChannels
            }

            await this.props.changeRoom(data);

        }

        this.switchChannel = async id => {

            let data = {
                channelID: id,
                roomID: this.props.roomID,
                username: this.props.username
            }

            await this.props.changeChannel(id);
            await this.props.getChatMessages(data);
            await this.socket.emit('SWITCH_ROOMS', {
                room: id,
                name: this.props.username
            })
        }


        this.joinRoom = async () => {
            // Replace later with modal input
            const id = await prompt();

            let data = {
                id: id,
                username: this.props.username
            }

            await this.props.joinRoom(data);

            await this.setState({ chatRooms: this.props.chatRooms })

        }

    }

    async componentDidMount() {
        await this.props.updateRooms(this.props.username);
        this.setState({ chatRooms: this.props.chatRooms });
    }

    addChatroom = async () => {
        const name = await prompt();

        // Add message informing user to enter correct data
        if (name === "" || name === null) {
            return;
        }

        let data = {
            id: uuid4(),
            name: name,
            owner: this.props.username
        }

        await this.props.newChatroom(data);

        this.setState({ chatRooms: this.props.chatRooms });

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

        // this.setState({ chatRooms: this.props.chatRooms });
    }

    deleteRoom = async (id, username) => {

        const data = {
            id: id,
            username: username
        }

        await this.props.deleteRoom(data);

        this.setState({ chatRooms: this.props.chatRooms });

    }

    // Changes selected room styles for visual clarity
    currentRoomStyle = (index) => {
        const isSelected = this.state.selectedRoom === index;
        // True is room selected, rest are not
        return isSelected ? "red" : "black";
    }

    // Disables click on currect room to prevent multiple socket calls
    currentRoomDisable = (index) => {
        const isSelected = this.state.selectedRoom === index;
        return isSelected ? true : false;
    }

    render() {

        let ownedChatrooms = this.state.chatRooms.owned.map((room, index) => {
            return <div key={room.id}>
                <button
                    style={{ color: this.currentRoomStyle(room.id) }}
                    onClick={() => this.switchChatroom(room.id, room.name, room.channels)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name}
                </button>
                <button onClick={() => this.deleteRoom(room.id, this.props.username)}>DELETE</button>
            </div>
        })

        let joinedChatrooms = this.state.chatRooms.joined.map((room, index) => {
            return <div key={room.id}>
                <button
                    style={{ color: this.currentRoomStyle(room.id) }}
                    onClick={() => this.switchChatroom(room.id, room.name, room.channels)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name}
                </button>
            </div>
        })

        let channels = this.props.channels.map(el => {
            return <div style={{ color: "white" }}>
                <button
                    onClick={() => this.switchChannel(el.id)}
                >{el.name}</button>
            </div>
        })


        return (
            <div className={styles.Sidebar}>
                <button onClick={this.addChatroom}>ADD NEW ROOM</button>
                <button onClick={this.joinRoom}>JOIN ROOM</button>
                <button onClick={this.addChannel}>NEW CHANNEL</button>
                {ownedChatrooms}
                {joinedChatrooms}
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