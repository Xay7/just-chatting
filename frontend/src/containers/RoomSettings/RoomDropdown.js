import React from 'react';
import styles from './RoomSettings.module.scss';
import RoomSetting from './RoomSetting';
import usePortal from 'helpers/usePortal';
import Modal from 'components/Modal/Modal';

const RoomDropdown = () => {
  const portal = usePortal();

  return portal(
    <div className={styles.Options}>
      <RoomSetting icon={'far fa address card'}>1</RoomSetting>
      <RoomSetting icon={'far fa address card'}>2</RoomSetting>
      <RoomSetting icon={'far fa address card'}>3</RoomSetting>
    </div>
  );
};

export default RoomDropdown;
