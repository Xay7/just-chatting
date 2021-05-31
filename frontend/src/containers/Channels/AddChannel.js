import React, { useState } from 'react';
import Modal from 'components/Modal/Modal';
import Options from 'components/Options/Options';
import ChatInput from 'components/ChatInput/ChatInput';
import Button from 'components/Button/Button';
import styles from './Channels.module.scss';
import { newChannel } from 'store/actions/index';
import { useSelector, useDispatch } from 'react-redux';

const AddChannel = (props) => {
  const { username, roomID, errorMessage } = useSelector((state) => ({
    username: state.auth.username,
    roomID: state.chat.roomID,
    errorMessage: state.auth.errorMessage,
  }));
  const dispatch = useDispatch();

  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');

  const addChannel = () => {
    if (!channelName) {
      return console.log("can't be empty");
    }

    let data = {
      username: username,
      id: roomID,
      name: channelName,
      description: channelDescription,
    };

    dispatch(newChannel(data));

    props.show();
    setChannelName('');
    setChannelDescription('');
  };

  const channelNameHandler = (e) => {
    setChannelName(e.target.value);
  };

  const channelDescriptionHandler = (e) => {
    setChannelDescription(e.target.value);
  };

  return (
    <React.Fragment>
      <Modal onClick={props.show} />
      <Options>
        <div className={styles.AddChannelWrapper}>
          <div className={styles.AddChannelDescription}>
            <h3>Create new channel</h3>
          </div>
          <ChatInput
            Type="text"
            OnChange={channelNameHandler}
            Placeholder="Enter channel name"
            ID="channelName"
            AutoComplete="off"
            ClassName={errorMessage ? 'InputError' : 'Input'}>
            Room Name
          </ChatInput>
          <ChatInput
            Type="text"
            OnChange={channelDescriptionHandler}
            Placeholder="Tell others what is this channel about"
            ID="channelDescription"
            AutoComplete="off"
            ClassName={errorMessage ? 'InputError' : 'Input'}>
            Room Name
          </ChatInput>
          <div className={styles.AddChannelBtns}>
            <Button ClassName="Cancel" OnClick={() => props.show()}>
              Cancel
            </Button>
            <Button ClassName="Confirm" OnClick={() => addChannel()}>
              Submit
            </Button>
          </div>
        </div>
      </Options>
    </React.Fragment>
  );
};

export default AddChannel;
