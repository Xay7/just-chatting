import React, { Component } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Chatbox from '../Chatbox/Chatbox';
import Users from '../Users/Users';
import styles from './Chat.module.scss';
import io from 'socket.io-client';

export const socketChat = io('http://localhost:3001');

class Chat extends Component {

    render() {
        return (
            <div className={styles.Chat}>
                <Sidebar />
                <Chatbox />
                <Users />

            </div>
        )
    }
}



export default Chat;