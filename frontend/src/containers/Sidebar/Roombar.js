import React, { useState } from 'react';
import styles from './RoomHelpers.module.scss';
import { useSelector } from 'react-redux';
import RoomDropdown from 'containers/RoomSettings/RoomDropdown';
import Modal from 'components/Modal/Modal';

const Roombar = () => {
  const { roomName, roomID } = useSelector((state) => ({
    roomName: state.chat.roomName,
    roomID: state.chat.roomID,
  }));
  const [showDropdown, setShowDropdown] = useState(false);

  const showDropdownHandler = () => {
    console.log('imclickedlol');
    setShowDropdown(!showDropdown);
  };

  return (
    <React.Fragment>
      {showDropdown ? (
        <React.Fragment>
          <Modal onClick={showDropdownHandler} />
          <RoomDropdown />
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

export default Roombar;
