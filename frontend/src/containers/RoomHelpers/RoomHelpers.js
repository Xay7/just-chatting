import React, { useState } from 'react';
import styles from './RoomHelpers.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { clearFetchMessage } from '../../store/actions/index';
import ChannelSettings from 'containers/Channels/ChannelSettings';

const RoomHelpers = () => {
  const { roomID, channelName, channelDescription, channels } = useSelector((state) => ({
    roomName: state.chat.roomName,
    roomID: state.chat.roomID,
    channels: state.chat.channels,
    username: state.auth.username,
    socketChat: state.auth.socket,
    avatar: state.auth.avatar,
  }));
  const dispatch = useDispatch();

  const [showChannelSettings, setShowChannelSettings] = useState(false);

  const showChannelSettingsHandler = () => {
    dispatch(clearFetchMessage());
    setShowChannelSettings(!showChannelSettings);
  };

  return (
    <React.Fragment>
      {!roomID ? null : (
        <React.Fragment>
          {showChannelSettings && <ChannelSettings display={showChannelSettingsHandler} />}
          <div className={styles.RoomHelpers}>
            {channels.length === 0 ? null : (
              <div className={styles.Channel}>
                <h2 className={styles.ChannelName}>{channelName}</h2>
                <p className={styles.ChannelDescription}>{channelDescription}</p>
                {/* {user_id === owner_id && (
                  <Tooltip
                    where="Left"
                    distance="-105px"
                    wrapper="Right"
                    text="Channel settings"
                    height="50px"
                    width="50px"
                    margin="0 0 0px 0"
                    position="absolute">
                    <i
                      className="fas fa-cog fa-lg"
                      style={{
                        position: 'absolute',
                        right: '0',
                        marginRight: '20px',
                        color: '#444444',
                        ':hover': {
                          color: '#BBB',
                          cursor: 'pointer',
                        },
                      }}
                      onClick={showChannelSettings}></i>
                  </Tooltip>
                )} */}
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default RoomHelpers;
