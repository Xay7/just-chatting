import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar';
import Chatbox from '../Chatbox/Chatbox';
import Users from '../../components/Users/Users';
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

export default connect(null)(Chat);