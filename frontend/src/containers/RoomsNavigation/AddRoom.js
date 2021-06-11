import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'components/Modal/Modal';
import Options from 'components/Options/Options';
import styles from './Rooms.module.scss';
import ChatInput from 'components/ChatInput/ChatInput';
import Button from 'components/Button/Button';
import { newChatroom } from '../../store/actions/index';

const AddRoom = (props) => {
  const { errorMessage } = useSelector((state) => ({
    errorMessage: state.auth.errorMessage,
    chatRooms: state.chat.chatRooms,
    socketChat: state.auth.socket,
  }));
  const dispatch = useDispatch();

  const [roomNameLocal, setRoomNameLocal] = useState('');

  const roomNameHandler = (e) => {
    setRoomNameLocal(e.target.value);
  };

  const addChatroom = async () => {
    if (roomNameLocal === '') {
      return;
    }

    dispatch(newChatroom(roomNameLocal));
    props.showAdd();
  };

  return (
    <div>
      <Modal onClick={props.showAdd} />
      <Options>
        <div className={styles.AddJoinWrapper}>
          <div className={styles.AddJoinDescription}>
            <h3>Create your room</h3>
          </div>
          <ChatInput
            Type="text"
            OnChange={roomNameHandler}
            Placeholder="Enter room name"
            ID="room"
            AutoComplete="off"
            ClassName={errorMessage ? 'InputError' : 'Input'}>
            Room Name
          </ChatInput>
          <div className={styles.AddJoinBtns}>
            <Button ClassName="Cancel" OnClick={props.showAdd}>
              Cancel
            </Button>
            <Button ClassName="Confirm" OnClick={addChatroom}>
              Submit
            </Button>
          </div>
        </div>
      </Options>
    </div>
  );
};

export default AddRoom;
