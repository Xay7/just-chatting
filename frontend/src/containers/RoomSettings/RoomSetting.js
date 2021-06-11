import React, { useState } from 'react';
import styles from './RoomSettings.module.scss';

const RoomSetting = (props) => {
  const [showInviteString, setShowInviteString] = useState(false);

  const showInviteHandler = (e) => {
    setShowInviteString(!showInviteString);
  };

  return (
    <div className={styles.OptionsBtn}>
      <div className={styles.IconsWrapper}>
        <i className={props.icon}></i>
      </div>
      <div className={styles.OptionsDescription} onClick={props.onClick}>
        {props.children}
      </div>
    </div>
  );
};

export default RoomSetting;
