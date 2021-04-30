import React, { Fragment } from 'react';
import ChannelBar from '../Sidebar/Channelbar';
import Chatbox from '../Chatbox/Chatbox';
import Users from '../Users/Users';
import styles from './Chat.module.scss';
import RoomHelpers from '../RoomHelpers/RoomHelpers';
import Rooms from '../Rooms/Rooms';

const Chat = () => {
  return (
    <Fragment>
      <div className={styles.Holder}>
        <Rooms />
        <div>
          <ChannelBar />
        </div>
        <div className={styles.Chat}>
          <RoomHelpers />
          <div className={styles.ChatBottom}>
            <Chatbox />
            <Users />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Chat;
