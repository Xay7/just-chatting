import React, { Fragment, useState } from 'react';
import ChannelNavigation from '../ChannelNavigation/ChannelNavigation';
import Chatbox from '../Chatbox/Chatbox';
import UsersList from 'containers/UsersList/UsersList';
import styles from './Chat.module.scss';
import RoomsNavigation from '../RoomsNavigation/RoomsNavigation';
import ChannelHeader from 'containers/ChannelHeader/ChannelHeader';

const Chat = () => {
  const [inRoom, setInRoom] = useState(false);

  const inRoomHandler = () => {
    setInRoom(true);
  };

  return (
    <Fragment>
      <div className={styles.Holder}>
        <RoomsNavigation inRoom={inRoomHandler} />
        <div>
          <ChannelNavigation />
        </div>
        <div className={styles.Chat}>
          <ChannelHeader />
          <div className={styles.ChatBottom}>
            {inRoom && <Chatbox />}
            <UsersList />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Chat;
