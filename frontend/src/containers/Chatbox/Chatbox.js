import React, { useState, useRef, useEffect } from 'react';
import styles from './Chatbox.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getChatMessages, storeMessage, isFetching } from '../../store/actions/index';
import UserTyping from '../../components/UserTyping/UserTyping';
import Loader from '../../components/Loader/Loader';
import Message from './Message';
import socket from 'SocketClient';
import InputContainer from './InputContainer';

const Chatbox = () => {
  const { channels, roomID, channelID, noMessages, loading, messages } = useSelector((state) => ({
    channels: state.chat.channels,
    username: state.auth.username,
    roomID: state.chat.roomID,
    avatar: state.auth.avatar,
    channelID: state.chat.channelID,
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    roomName: state.chat.roomName,
    loading: state.chat.loading,
    messages: state.chat.messages,
  }));
  const dispatch = useDispatch();
  const messageContainer = useRef(null);

  const [channelMessages, setChannelMessages] = useState([]);
  const [sameUserMessage, setSameUserMessage] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [skipMessages, setSkipMessages] = useState(50);

  useEffect(() => {
    socket.on('RECEIVE_MESSAGE', function (data) {
      addMessage(data);
    });

    socket.on('UPDATING_MESSAGES', (data) => {
      setChannelMessages(messages);
    });

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

      scrollToBottom();
    });
  }, []);

  const addMessage = (data) => {
    if (messages.length === 0) {
      return;
    }
    console.log(channelMessages);
    if (data.author.name === messages.slice(-1)[0].author) {
      setSameUserMessage(true);
    } else {
      setSameUserMessage(false);
    }
    setChannelMessages([...channelMessages, data]);
    setIsOtherUserTyping(false);

    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (messageContainer.current === null) return;
    console.log(messageContainer.current);
    const scrollHeight = messageContainer.current.scrollHeight;
    const height = messageContainer.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    messageContainer.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  const getMoreMessages = async () => {
    if (messageContainer.current.scrollTop === 0 && !noMessages) {
      isFetching();

      const previosScrollHeight = messageContainer.scrollHeight;

      let data = {
        channel_id: channelID,
        skipMessages: skipMessages,
      };

      dispatch(getChatMessages(data));

      let mess = [...messages, ...channelMessages];
      setChannelMessages(mess);

      messageContainer.current.scrollTop = messageContainer.current.scrollHeight - previosScrollHeight;
    }
  };

  let messagesStructure = messages.map((data, index, arr) => {
    return (
      <Message author={data.author} message={data.body} created={data.created_at} index={index} arr={arr} previousMessage={index > 1 ? arr[index - 1] : null} />
    );
  });

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
