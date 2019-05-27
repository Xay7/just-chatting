import React, { Component, Fragment } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Chatbox from '../Chatbox/Chatbox';
import Users from '../Users/Users';
import styles from './Chat.module.scss';
import RoomHelpers from '../RoomHelpers/RoomHelpers';
import Rooms from '../Rooms/Rooms';

class Chat extends Component {


    render() {
        return (
            <Fragment>
                <div className={styles.Holder}>
                    <Rooms />
                    <div className={styles.xd}>
                        <RoomHelpers />
                        <div className={styles.Chat}>
                            <Sidebar />
                            <Chatbox />
                            <Users />
                        </div>
                    </div>



                </div>
            </Fragment>
        )
    }
}



export default Chat;