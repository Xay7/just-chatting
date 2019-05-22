import React, { Component } from 'react';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../../store/actions/auth';
import uuid4 from 'uuid4'

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chatRooms: [],
            selectedRoom: '',
        }

        this.socket = this.props.socketChat;

        this.switchChatroom = async (room, index) => {
            await this.setState({ selectedRoom: index });
            await this.props.changeRoom(room);
            await this.socket.emit('SWITCH_ROOMS', {
                room: room,
                name: this.props.name
            })
        }
    }

    async componentDidMount() {
        await this.setState({ chatRooms: this.props.chatRooms });
        await console.log(this.state);
    }

    addNewRoom = async () => {
        const name = await prompt();

        let data = {
            id: uuid4(),
            name: name,
            owner: this.props.name
        }

        await axios.post('http://localhost:3001/users/newchat', data);

        const token = localStorage.getItem('JWT_TOKEN');

        const res = await axios.get('http://localhost:3001/users/chat', {
            headers: {
                'authorization': token
            }
        })

        this.setState({ chatRooms: res.data.chatRooms });

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



        let rooms = this.state.chatRooms.map((room, index) => {
            return <div>
                <button
                    style={{ color: this.currentRoomStyle(index) }}
                    onClick={() => this.switchChatroom(room.id, index)}
                    key={index}
                    disabled={this.currentRoomDisable(index)}>{room.name}
                </button>
                <button>DELETE</button>
            </div>
        })

        return (
            <div className={styles.Sidebar}>
                <button onClick={this.addNewRoom}>ADD NEW ROOM</button>
                {rooms}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        chatRooms: state.auth.chatRooms,
        name: state.auth.name,
        socketChat: state.auth.socket
    }

}

export default connect(mapStateToProps, actions)(Sidebar);