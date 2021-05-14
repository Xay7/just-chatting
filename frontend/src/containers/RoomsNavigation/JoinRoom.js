import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'components/Modal/Modal';
import Options from 'components/Options/Options';
import styles from './Rooms.module.scss';
import ChatInput from 'components/ChatInput/ChatInput';
import Button from 'components/Button/Button';
import FetchResponse from 'components/FetchResponse/FetchResponse';
import { joinRoom } from '../../store/actions/index';

const JoinRoom = (props) => {
  const { errorMessage, user_id } = useSelector((state) => ({
    errorMessage: state.auth.errorMessage,
    user_id: state.auth.user_id,
  }));

  const dispatch = useDispatch();

  const [roomID, setRoomID] = useState('');

  const roomIdHandler = (e) => {
    setRoomID(e.target.value);
  };
  const joinRoomHandler = async () => {
    if (!roomID) {
      return;
    }
    const data = {
      id: roomID,
      user_id: user_id,
    };

    dispatch(joinRoom(data));

    if (errorMessage) {
      return;
    }

    props.showJoin();
  };

  return (
    <div>
      <Modal onclick={props.showJoin} />
      <Options>
        <div className={styles.AddJoinWrapper}>
          <div className={styles.AddJoinDescription}>
            <h3>Join existing room</h3>
          </div>
          <ChatInput
            Type="text"
            OnChange={roomIdHandler}
            Placeholder="Enter room ID"
            ID="room"
            AutoComplete="off"
            ClassName={errorMessage ? 'InputError' : 'Input'}>
            Room ID
          </ChatInput>
          {errorMessage && <FetchResponse>{errorMessage}</FetchResponse>}
          <div className={styles.AddJoinBtns}>
            <Button ClassName="Cancel" OnClick={props.showJoin}>
              Cancel
            </Button>
            <Button ClassName="Confirm" OnClick={joinRoomHandler}>
              Submit
            </Button>
          </div>
        </div>
      </Options>
    </div>
  );
};

export default JoinRoom;
