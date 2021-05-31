import React, { useState, useRef, useEffect } from 'react';
import styles from './Chatbox.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessages, isFetching } from '../../store/actions/index';
import UserTyping from '../../components/UserTyping/UserTyping';
import Loader from '../../components/Loader/Loader';
import Message from './Message';
import socket from 'SocketClient';
import InputContainer from './InputContainer';

const Chatbox = () => {
  const { channels, roomID, channelID, noMessages, loading, messages, skip } = useSelector((state) => ({
    channels: state.chat.channels,
    username: state.auth.username,
    roomID: state.chat.roomID,
    channelID: state.chat.channelID,
    loading: state.chat.loading,
    messages: state.chat.messages,
    noMessages: state.chat.noMessages,
    skip: state.chat.skip,
  }));
  const dispatch = useDispatch();

  const [channelMessages, setChannelMessages] = useState([]);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const messageContainer = useRef(null);

  useEffect(() => {
    socket.on('RECEIVE_MESSAGE', function (data) {
      addMessage(data);
    });

    // socket.on('USER_JOINED_CHANNEL', (data) => {
    //   setChannelMessages(messages);
    // });

    socket.on('SOMEONE_IS_TYPING', () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      setIsOtherUserTyping(true);
      setTypingTimeout(
        setTimeout(() => {
          setIsOtherUserTyping(false);
        }, 2000)
      );
    });

    return () => {
      socket.close();
    };
  }, []);

  const addMessage = (data) => {
    if (messages.length === 0) {
      return;
    }

    setChannelMessages([...channelMessages, data]);
    setIsOtherUserTyping(false);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (messageContainer.current === null) return;
    const scrollHeight = messageContainer.current.scrollHeight;
    const height = messageContainer.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    messageContainer.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  const getMoreMessages = async () => {
    if (messageContainer.current.scrollTop === 0 && !noMessages) {
      dispatch(isFetching());

      const previosScrollHeight = messageContainer.scrollHeight;

      let data = {
        channel_id: channelID,
        skipMessages: skip,
      };
      await dispatch(getChatMessages(data));
      let mess = [...messages, ...channelMessages];
      setChannelMessages(mess);

      messageContainer.current.scrollTop = messageContainer.current.scrollHeight - previosScrollHeight;
    }
  };
  let messagesStructure;
  if (messages.length > 0) {
    messagesStructure = messages.map((data, index, arr) => {
      return (
        <Message
          author={data.author}
          message={data.body}
          created={data.created_at}
          index={index}
          arr={arr}
          previousMessage={index > 0 ? arr[index - 1] : null}
        />
      );
    });
  } else messagesStructure = null;

  return (
    <React.Fragment>
      {!roomID || channels.length === 0 ? null : (
        <div className={styles.Chatbox}>
          {loading && <Loader />}
          <div className={styles.MessagesContainer} ref={messageContainer} onScroll={getMoreMessages}>
            {messagesStructure}
            {isOtherUserTyping ? <UserTyping /> : null}
          </div>
          <InputContainer />
        </div>
      )}
    </React.Fragment>
  );
};
export default Chatbox;
