import React, { Component } from 'react';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import axios from 'axios';
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

        this.switchChatroom = async (room, index) => {
            await this.setState({ selectedRoom: room });
            await this.props.changeRoom(room);
            await this.socket.emit('SWITCH_ROOMS', {
                room: room,
                name: this.props.name
            })
        }

        this.joinRoom = async () => {
            // Replace later with modal input
            const id = await prompt();

            let data = {
                id: id,
                name: this.props.name
            }

            await this.props.joinRoom(data);

            await this.setState({ chatRooms: this.props.chatRooms })

        }

    }

    async componentDidMount() {
        await this.props.getRooms();
        this.setState({ chatRooms: this.props.chatRooms });
    }

    addNewRoom = async () => {
        const name = await prompt();

        // Add message informing user to enter correct data
        if (name === "" || name === null) {
            return;
        }

        let data = {
            id: uuid4(),
            name: name,
            owner: this.props.name
        }

        await this.props.newRoom(data);

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
                    onClick={() => this.switchChatroom(room.id, index)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name}
                </button>
                <button>DELETE</button>
            </div>
        })

        let joinedChatrooms = this.state.chatRooms.joined.map((room, index) => {
            return <div key={room.id}>
                <button
                    style={{ color: this.currentRoomStyle(room.id) }}
                    onClick={() => this.switchChatroom(room.id, index)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name}
                </button>
            </div>
        })

        return (
            <div className={styles.Sidebar}>
                <button onClick={this.addNewRoom}>ADD NEW ROOM</button>
                <button onClick={this.joinRoom}>JOIN ROOM</button>
                {ownedChatrooms}
                {joinedChatrooms}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        chatRooms: state.chat.chatRooms,
        name: state.auth.name,
        socketChat: state.auth.socket
    }

}

export default connect(mapStateToProps, actions)(Sidebar);