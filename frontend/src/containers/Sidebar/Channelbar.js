import React, { useState } from 'react';
import styles from './Sidebar.module.scss';
import { useSelector } from 'react-redux';
import Channels from '../Channels/Channels';
import UserSettings from '../UserSettings/UserSettings';
import Tooltip from '../../components/Tooltip/Tooltip';
import Roombar from './Roombar';
const Sidebar = () => {
  const { username, roomID, avatar } = useSelector((state) => ({
    username: state.auth.username,
    roomID: state.chat.roomID,
    avatar: state.auth.avatar,
  }));
  const [showUserSettings, setShowUserSettings] = useState(false);

  const showUserSettingsHandler = (e) => {
    setShowUserSettings(!showUserSettings);
  };

  return (
    <React.Fragment>
      <Roombar />
      {showUserSettings && <UserSettings toggleDisplay={showUserSettingsHandler} />}
      <div className={styles.Sidebar}>
        {roomID && <Channels />}
        <div className={styles.User}>
          <img src={avatar} alt={username + ' avatar'} className={styles.Avatar} />
          <p style={{ color: 'white' }}>{username}</p>
          <Tooltip where="Top" distance="-35px" text="User settings" wrapper="Right" height="auto" width="50px" margin="0 5px 0 0" position="absolute">
            <i
              className="fas fa-cog fa-lg"
              style={{
                color: 'white',
                ':hover': {
                  color: '#BBB',
                  cursor: 'pointer',
                },
              }}
              onClick={showUserSettingsHandler}></i>
          </Tooltip>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
