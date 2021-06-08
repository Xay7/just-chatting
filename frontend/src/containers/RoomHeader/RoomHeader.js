import React, { useState } from 'react';
import styles from './RoomHeader.module.scss';
import { useSelector } from 'react-redux';
import RoomDropdown from 'containers/RoomSettings/RoomDropdown';
import Modal from 'components/Modal/Modal';

const RoomHeader = () => {
  const { roomName, roomID } = useSelector((state) => ({
    roomName: state.chat.roomName,
    roomID: state.chat.roomID,
  }));
  const [showDropdown, setShowDropdown] = useState(false);

  const showDropdownHandler = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <React.Fragment>
      {showDropdown && roomName ? (
        <React.Fragment>
          <Modal onClick={showDropdownHandler} />
          <RoomDropdown show={showDropdownHandler} />
        </React.Fragment>
      ) : null}
      <div className={styles.Room} onClick={showDropdownHandler}>
        <h2 className={styles.RoomName}>{roomName}</h2>
        {roomID && (
          <i
            className="fas fa-caret-down fa-lg"
            style={{
              color: 'white',
              marginRight: '22px',
            }}></i>
        )}
      </div>
    </React.Fragment>
  );
};

export default RoomHeader;
