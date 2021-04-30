import React, { useState, useRef } from 'react';
import styles from './RoomSettings.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { deleteChatroom, leaveChatroom } from '../../store/actions/index';
import Modal from '../../components/Modal/Modal';
import Confirm from '../../components/Confirm/Confirm';
import Options from '../../components/Options/Options';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import RoomSetting from './RoomSetting';

const RoomHeader = () => {
  const { room_id, roomName } = useSelector((state) => ({
    user_id: state.auth.user_id,
    roomOwner: state.chat.roomOwner,
    room_id: state.chat.roomID,
    roomName: state.chat.roomName,
  }));

  const [showConfirmAction, setShowConfirmAction] = useState(false);
  const [showLeaveBox, setShowLeaveBox] = useState(false);
  const [showInviteString, setShowInviteString] = useState(false);
  const [copiedInviteString, SetCopiedInviteString] = useState(false);
  const dispatch = useDispatch();
  const node = useRef(null);

  const deleteRoomHandler = () => {
    setShowConfirmAction(!showConfirmAction);
  };

  const deleteRoom = async (id) => {
    dispatch(deleteChatroom(id));
    setShowConfirmAction(!showConfirmAction);
  };

  const leaveRoomHandler = () => {
    setShowLeaveBox(!showLeaveBox);
  };

  const leaveRoom = async (id) => {
    dispatch(leaveChatroom(id));
    setShowLeaveBox(!showLeaveBox);
  };

  const hideconfirmAction = () => {
    setShowConfirmAction(!showConfirmAction);
  };

  let confirmAction = null;
  let inviteString = null;

  if (showConfirmAction) {
    confirmAction = (
      <React.Fragment>
        <Modal onclick={deleteRoomHandler} />
        <Confirm
          cancel={hideconfirmAction}
          confirm={() => deleteRoom(room_id)}
          header={`Delete ${roomName}`}
          description={`Are you sure you want to delete ${roomName}?`}
        />
      </React.Fragment>
    );
  }

  if (showLeaveBox) {
    confirmAction = (
      <React.Fragment>
        <Modal onclick={leaveRoomHandler} />
        <Confirm
          cancel={hideconfirmAction}
          confirm={() => leaveRoom(room_id)}
          header={`Leave ${roomName}`}
          description={`Are you sure you want to leave ${roomName}?`}
        />
      </React.Fragment>
    );
  }

  if (showInviteString) {
    inviteString = (
      <React.Fragment>
        <Modal onclick={null} />
        <Options>
          <div className={styles.InviteString}>
            <h3 style={{ marginTop: '10px' }}>Share this room ID with friends</h3>
            <div className={styles.InputWithBtn}>
              <input value={room_id} disabled className={styles.InviteInput} />
              <CopyToClipboard text={room_id}>
                <button className={styles.Copy} onClick={null}>
                  Copy
                </button>
              </CopyToClipboard>
            </div>
            {copiedInviteString ? (
              <p style={{ margin: 0 }}>
                Copied{' '}
                <span role="img" aria-label="thumbs up">
                  👍
                </span>
              </p>
            ) : (
              <span style={{ margin: 0, display: 'none' }}>
                Copied{' '}
                <span role="img" aria-label="thumbs up">
                  👍
                </span>
              </span>
            )}
          </div>
        </Options>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <RoomSetting icon={'far fa address card'} />
      <RoomSetting icon={'far fa address card'} />
      <RoomSetting icon={'far fa address card'} />
    </React.Fragment>
  );
};

export default RoomHeader;
