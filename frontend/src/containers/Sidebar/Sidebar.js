import React, { Component } from 'react';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../../store/actions/auth';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chatRooms: []
        }

        this.socket = this.props.socketChat;

        this.switchChatroom = (el) => {
            this.props.changeRoom(el);
            this.socket.emit('SWITCH_ROOMS', {
                room: el,
                name: this.props.name
            })
        }
    }



    async componentDidMount() {
        await this.setState({ chatRooms: this.props.chatRooms });
    }

    addNewRoom = async () => {
        const name = await prompt();

        let data = {
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

    render() {



        let rooms = this.state.chatRooms.map(el => {
            return <div style={{ color: 'white' }} onClick={() => this.switchChatroom(el)} >{el}</div>
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