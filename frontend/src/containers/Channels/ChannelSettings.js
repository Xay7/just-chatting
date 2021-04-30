import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeChannelData, deleteChannel } from 'store/actions/index';
import styles from './ChannelSettings.module.scss';
import Modal from 'components/Modal/Modal';
import Options from 'components/Options/Options';
import ChatInput from 'components/ChatInput/ChatInput';
import Button from 'components/Button/Button';
import FetchResponse from 'components/FetchResponse/FetchResponse';
import Confirm from 'components/Confirm/Confirm';

const ChannelSettings = (props) => {
  const { channelName, channelID, errorMessage, successMessage } = useSelector((state) => ({
    channelName: state.chat.channelName,
    channelID: state.chat.channelID,
    username: state.auth.username,
    roomID: state.chat.roomID,
    errorMessage: state.chat.errorMessage,
    successMessage: state.chat.successMessage,
  }));
  const dispatch = useDispatch();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [channelNameLocal, setChannelNameLocal] = useState('');
  const [channelDescription, setChannelDescription] = useState('');

  const changeData = () => {
    if (channelName === '' && channelDescription === '') {
      alert("Can't be empty!");
      return;
    }

    let data = {
      channelName: channelNameLocal,
      channelDescription: channelDescription,
      id: channelID,
      oldChannelName: channelName.substring(1),
    };

    dispatch(changeChannelData(data));
  };

  const showConfirmationHandler = () => {
    setShowConfirmation(!showConfirmation);
  };

  const channelNameHandler = (e) => {
    setChannelNameLocal(e.target.value);
  };

  const channelDescriptionHandler = (e) => {
    setChannelDescription(e.target.value);
  };

  const deleteChannelHandler = async (id) => {
    await dispatch(deleteChannel(id));
    setShowConfirmation(false);
    props.display();
  };

  return (
    <React.Fragment>
      {showConfirmation && (
        <React.Fragment>
          <Modal onclick={showConfirmationHandler} zIndex="2000" />
          <Confirm
            cancel={showConfirmationHandler}
            confirm={() => deleteChannelHandler(channelID)}
            header={`Delete ${channelName}`}
            description={`Are you sure you want to delete ${channelName}?`}
          />
        </React.Fragment>
      )}
      <Modal onclick={props.display} />
      <Options>
        <div className={styles.ChannelSettingsWrapper}>
          <h3>Edit channel settings</h3>
          <ChatInput
            Type="text"
            OnChange={channelNameHandler}
            Placeholder="New channel name"
            ID="channelName"
            AutoComplete="off"
            ClassName={errorMessage ? 'InputError' : 'Input'}>
            Channel Name
          </ChatInput>
          <ChatInput
            Type="text"
            OnChange={channelDescriptionHandler}
            Placeholder="New description"
            ID="channelDescription"
            AutoComplete="off"
            ClassName={errorMessage ? 'InputError' : 'Input'}>
            Channel description
          </ChatInput>
          {errorMessage && <FetchResponse>{errorMessage}</FetchResponse>}
          {successMessage && <FetchResponse>{successMessage}</FetchResponse>}
          <div className={styles.Btns}>
            <Button ClassName="Cancel" OnClick={props.display}>
              Cancel
            </Button>
            <Button ClassName="Confirm" OnClick={changeData}>
              Submit
            </Button>
          </div>
          <Button ClassName="Danger" OnClick={showConfirmationHandler}>
            Delete Channel
          </Button>
        </div>
      </Options>
    </React.Fragment>
  );
};

export default ChannelSettings;
