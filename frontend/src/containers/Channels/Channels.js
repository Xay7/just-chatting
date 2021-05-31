import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Channels.module.scss';
import { isFetching, changeChannel, getChatMessages } from 'store/actions/index';
import Tooltip from 'components/Tooltip/Tooltip';
import usePrevious from 'helpers/usePrevious';
import AddChannel from './AddChannel';
import socket from 'SocketClient';

const Channels = () => {
  const { channels, username, roomID, avatar, channelID, roomName } = useSelector((state) => ({
    channels: state.chat.channels,
    username: state.auth.username,
    roomID: state.chat.roomID,
    avatar: state.auth.avatar,
    channelID: state.chat.channelID,
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    roomName: state.chat.roomName,
  }));
  const dispatch = useDispatch();

  const [showAdd, setShowAdd] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('');
  const prevRoomID = usePrevious(roomID);
  const prevChannels = usePrevious(channels);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (prevRoomID !== roomID && channels[0]) {
      return switchChannel(channels[0].id, channels[0].name, channels[0].description);
    }
    // Check if channel is deleted and automatically join first one
    if (channels.length < prevChannels.length && channels[0]) {
      return switchChannel(channels[0].id, channels[0].name, channels[0].description);
    }
    // Auto join when there's no channels and user add new one
    if (prevChannels.length === 0 && channels.length > 0) {
      return switchChannel(channels[0].id, channels[0].name, channels[0].description);
    }
  });

  const switchChannel = (id, name, description) => {
    dispatch(isFetching());

    const previousChannel = selectedChannel;

    let data = {
      channel_id: id,
      skipMessages: 0,
    };

    setSelectedChannel(id);
    dispatch(changeChannel(id, name, description));
    dispatch(getChatMessages(data));

    socket.emit('JOIN_CHANNEL', {
      channelID: id,
      previousChannelID: previousChannel,
      name: username,
      avatar: avatar,
    });
  };

  const showAddChannel = () => {
    setShowAdd(!showAdd);
  };

  const currentChannelStyle = (index) => {
    const isSelected = channelID === index;
    return isSelected ? styles.ChannelSelected : styles.Channel;
  };

  const currentChannelDisable = (index) => {
    const isSelected = channelID === index;
    return isSelected ? true : false;
  };

  let channelsStructure = channels.map((el, index) => {
    return (
      <div key={el.id} className={currentChannelStyle(el.id)}>
        <button onClick={() => switchChannel(el.id, el.name, el.description)} disabled={currentChannelDisable(el.id)}>
          {'# ' + el.name}
        </button>
      </div>
    );
  });

  let noChannels = null;

  if (channels.length === 0) {
    noChannels = (
      <div className={styles.NoChannel}>
        <div className={styles.NoChannelsTextWrapper}>
          <h1>Waiting to join a channel</h1>
          <p>You can add channels by pressing plus button</p>
        </div>
      </div>
    );
  }

  const showAddChannels = () => {
    setShow(!show);
  };

  return (
    <React.Fragment>
      {show ? <AddChannel show={() => showAddChannels()} /> : null}
      <div className={styles.Channels}>
        {noChannels}
        <div className={styles.ChannelsHeader}>
          <h3 className={styles.ChannelTitle}>Channels</h3>
          {roomName ? (
            <Tooltip where="Right" distance="-70px" text="Add channel" wrapper="Right" height="auto" width="auto" margin="0 0px 0 0" position="relative">
              <button onClick={() => showAddChannels()} className={styles.AddChannel}>
                +
              </button>
            </Tooltip>
          ) : null}
        </div>
        <div className={styles.ChannelsList}>{channelsStructure}</div>
      </div>
    </React.Fragment>
  );
};

export default Channels;
