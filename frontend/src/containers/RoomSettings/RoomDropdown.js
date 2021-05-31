import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteChatroom, leaveChatroom } from '../../store/actions/index';
import styles from './RoomSettings.module.scss';
import RoomSetting from './RoomSetting';
import usePortal from 'helpers/usePortal';
import socket from '../../SocketClient';
import Modal from '../../components/Modal/Modal';
import Confirm from '../../components/Confirm/Confirm';
import Options from '../../components/Options/Options';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const RoomDropdown = (props) => {
  const { user_id, roomOwner, room_id, roomName } = useSelector((state) => ({
    user_id: state.auth.user_id,
    roomOwner: state.chat.roomOwner,
    room_id: state.chat.roomID,
    roomName: state.chat.roomName,
  }));
  const dispatch = useDispatch();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [isInviteCopied, setIsInviteCopied] = useState(false);
  const portal = usePortal();

  const hideconfirmAction = () => {
    setShowConfirmDelete(false);
  };

  const deleteRoomHandler = () => {
    setShowConfirmDelete(!showConfirmDelete);
  };

  const deleteRoom = async (id) => {
    await dispatch(deleteChatroom(id));
    setShowConfirmDelete(false);
  };

  const leaveRoomHandler = () => {
    setShowConfirmLeave(!showConfirmLeave);
  };

  const leaveRoom = async (id) => {
    await dispatch(leaveChatroom(id));
    setShowConfirmLeave(false);

    socket.emit('USER_LEFT', {
      room_id: room_id,
      user_id: user_id,
    });
  };

  const showInviteHandler = (e) => {
    setShowInviteLink(!showInviteLink);
    setIsInviteCopied(false);
  };

  const copiedInviteString = () => {
    setIsInviteCopied(true);
  };

  let confirmAction = null;
  let inviteString = null;

  if (showConfirmDelete) {
    confirmAction = (
      <React.Fragment>
        <Modal onClick={props.show} />
        <Confirm
          cancel={hideconfirmAction}
          confirm={() => deleteRoom(room_id)}
          header={`Delete ${roomName}`}
          description={`Are you sure you want to delete ${roomName}?`}
        />
      </React.Fragment>
    );
  }

  if (showConfirmLeave) {
    confirmAction = (
      <React.Fragment>
        <Modal onClick={props.show} />
        <Confirm
          cancel={hideconfirmAction}
          confirm={() => leaveRoom(room_id)}
          header={`Leave ${roomName}`}
          description={`Are you sure you want to leave ${roomName}?`}
        />
      </React.Fragment>
    );
  }

  if (showInviteLink) {
    inviteString = (
      <React.Fragment>
        <Modal onClick={props.show} />
        <Options>
          <div className={styles.InviteString}>
            <h3 style={{ marginTop: '10px' }}>Share this room ID with friends</h3>
            <div className={styles.InputWithBtn}>
              <input value={room_id} disabled className={styles.InviteInput} />
              <CopyToClipboard text={room_id}>
                <button className={styles.Copy} onClick={copiedInviteString}>
                  Copy
                </button>
              </CopyToClipboard>
            </div>
            {isInviteCopied ? (
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

  return portal(
    <div className={styles.Options}>
      {confirmAction}
      {inviteString}
      <RoomSetting icon={'fas fa-user-plus'} onClick={showInviteHandler}>
        Invite link
      </RoomSetting>

      {user_id === roomOwner.id ? (
        <RoomSetting icon={'fas fa-trash-alt'} onClick={deleteRoomHandler}>
          Delete room
        </RoomSetting>
      ) : (
        <RoomSetting icon={'fas fa-door-open'} onClick={leaveRoomHandler}>
          Leave room
        </RoomSetting>
      )}
    </div>
  );
};

export default RoomDropdown;
