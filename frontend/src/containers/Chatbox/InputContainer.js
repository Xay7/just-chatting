import React, { useState, useRef } from 'react';
import styles from './Chatbox.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { storeMessage } from '../../store/actions/index';
import socket from 'SocketClient';
import moment from 'moment';

const InputContainer = () => {
  const { channelID, avatar, username } = useSelector((state) => ({
    channelID: state.chat.channelID,
    avatar: state.auth.avatar,
    username: state.auth.username,
  }));
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (e) => {
    let dbmessage = {
      body: message,
      id: channelID,
      created_at: moment(),
    };

    dispatch(storeMessage(dbmessage));
  };

  const enterHandler = async (e) => {
    if (e.keyCode === 13 && message !== '') {
      sendMessage();
      setMessage('');
      setIsTyping(false);
    }
  };
  const onChangeHandler = (e) => {
    socket.emit('CLIENT_IS_TYPING', {
      channel: channelID,
    });
    setMessage(e.target.value);
  };

  return (
    <div className={styles.InputContainer}>
      <input type="text" onKeyDown={enterHandler} placeholder="Enter your message" className={styles.MessageInput} value={message} onChange={onChangeHandler} />
    </div>
  );
};

export default InputContainer;
