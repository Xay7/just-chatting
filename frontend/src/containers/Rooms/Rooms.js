import React, { Component } from 'react';
import styles from './Rooms.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/chatroom';
import uuid4 from 'uuid4';
import Modal from '../../components/Modal/Modal';

class Rooms extends Component {

    state = {
        chatRooms: {
            owned: [],
            joined: []
        },
        selectedRoom: '',
        showAddOrJoin: false
    }


    switchChatroom = async (roomID, roomName, roomChannels) => {
        await this.setState({ selectedRoom: roomID });

        let data = {
            room: roomID,
            username: this.props.username,
            roomName: roomName,
            roomChannels: roomChannels
        }

        await this.props.changeRoom(data);

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

    CreateOrJoinRoom = () => {
        console.log("xd");
        this.setState({ showAddOrJoin: !this.state.showAddOrJoin })
    }

    async componentDidMount() {
        await this.props.updateRooms(this.props.username);
        this.setState({ chatRooms: this.props.chatRooms });
    }

    // Changes selected room styles for visual clarity
    currentRoomStyle = (index) => {
        const isSelected = this.state.selectedRoom === index;
        // True is room selected, rest are not
        return isSelected ? styles.RoomSelected : styles.RoomNotSelected;
    }
    // Disables click on currect room to prevent multiple socket calls
    currentRoomDisable = (index) => {
        const isSelected = this.state.selectedRoom === index;
        return isSelected ? true : false;
    }

    render() {

        let ownedChatrooms = this.state.chatRooms.owned.map(room => {
            return <div key={room.id}>
                <button
                    className={this.currentRoomStyle(room.id)}
                    onClick={() => this.switchChatroom(room.id, room.name, room.channels)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name}
                </button>
            </div>
        })

        let joinedChatrooms = this.state.chatRooms.joined.map(room => {
            return <div key={room.id}>
                <button
                    className={this.currentRoomStyle(room.id)}
                    onClick={() => this.switchChatroom(room.id, room.name, room.channels)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name}
                </button>
            </div>
        })

        let addOrJoin = null;

        if (this.state.showAddOrJoin) {
            addOrJoin = <div >
                <Modal onclick={this.CreateOrJoinRoom} />
            </div>
        }


        return (
            <React.Fragment>
                {addOrJoin}
                <div className={styles.Rooms}>
                    {ownedChatrooms}
                    {joinedChatrooms}
                    <button
                        onClick={this.CreateOrJoinRoom}
                        className={styles.AddChatroom}>+</button>
                </div>
            </React.Fragment>

        )
    }
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        chatRooms: state.chat.chatRooms
    }
}

export default connect(mapStateToProps, actions)(Rooms);