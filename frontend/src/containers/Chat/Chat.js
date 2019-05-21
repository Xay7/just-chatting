import React, { Component } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Chatbox from '../Chatbox/Chatbox';
import Users from '../Users/Users';
import styles from './Chat.module.scss';

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