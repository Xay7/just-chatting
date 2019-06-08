import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Channels.module.scss';
import * as actions from '../../store/actions/chatroom';
import uuid4 from 'uuid4'
import Modal from '../../components/Modal/Modal';
import Options from '../../components/Options/Options';
import ChatInput from '../../components/ChatInput/ChatInput';
import Button from '../../components/Button/Button';

class Channels extends Component {

    constructor(props) {
        super(props)

        this.state = {
            showAddChannel: false,
            channelName: '',
            channelDescription: '',
        }

        this.socket = this.props.socketChat;

        this.switchChannel = async (id, name, description) => {

            await this.setState({ selectedChannel: id });

            let data = {
                channelID: id,
                roomID: this.props.roomID,
                username: this.props.username,
            }

            await this.props.changeChannel(id, name, description);
            await this.props.getChatMessages(data);
            await this.socket.emit('JOIN_CHANNEL', {
                room: id,
                name: this.props.username,
                avatar: this.props.avatar
            })
        }

    }

    addChannel = async () => {
        let data = {
            username: this.props.username,
            id: this.props.roomID,
            channelID: uuid4(),
            name: this.state.channelName,
            description: this.state.channelDescription
        }

        await this.props.newChannel(data);

        this.showAddChannel();

    }

    showAddChannel = () => {
        this.setState({ showAddChannel: !this.state.showAddChannel });
    }


    channelNameHandler = (e) => {
        this.setState({ channelName: e.target.value })
    }

    channelDescriptionHandler = (e) => {
        this.setState({ channelDescription: e.target.value })
    }

    currentChannelStyle = (index) => {
        const isSelected = this.props.channelID === index;
        return isSelected ? styles.ChannelSelected : styles.Channel
    }

    currentChannelDisable = (index) => {
        const isSelected = this.props.channelID === index;
        return isSelected ? true : false;
    }

    render() {

        let channels = this.props.channels.map((el, index) => {
            return <div style={{ color: "white" }} key={el.id} className={styles.ChannelWrapper}>
                <button
                    onClick={() => this.switchChannel(el.id, el.name, el.description)}
                    disabled={this.currentChannelDisable(el.id)}
                    className={this.currentChannelStyle(el.id)}
                >{"# " + el.name}</button>
            </div>
        });

        let addChannel = null;

        if (this.state.showAddChannel) {
            addChannel = <React.Fragment >
                <Modal onclick={this.showAddChannel} />
                <Options >
                    <div className={styles.AddChannelWrapper}>
                        <div className={styles.AddChannelDescription}>
                            <h3>Create new channel</h3>
                        </div>
                        <ChatInput
                            Type="text"
                            OnChange={this.channelNameHandler}
                            Placeholder="Enter channel name"
                            ID="channelName"
                            autoComplete="off"
                            ClassName={this.props.errorMessage ? "InputError" : "Input"}
                        >Room Name</ChatInput>
                        <ChatInput
                            Type="text"
                            OnChange={this.channelDescriptionHandler}
                            Placeholder="Tell others what is this channel about"
                            ID="channelDescription"
                            autoComplete="off"
                            ClassName={this.props.errorMessage ? "InputError" : "Input"}
                        >Room Name</ChatInput>
                        <div className={styles.AddChannelBtns}>
                            <Button ClassName="Cancel" OnClick={this.showAddChannel}>Cancel</Button>
                            <Button ClassName="Confirm" OnClick={this.addChannel}>Submit</Button>
                        </div>
                    </div>
                </Options>
            </React.Fragment>;
        }


        return (
            <React.Fragment>
                {addChannel}
                <div className={styles.Channels}>
                    <div className={styles.ChannelsHeader}>
                        <h3 className={styles.ChannelTitle}>Channels</h3>
                        {this.props.roomName ? <button onClick={this.showAddChannel} className={styles.AddChannel}>+</button> : null}
                    </div>
                    {channels}
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        channels: state.chat.channels,
        username: state.auth.username,
        socketChat: state.auth.socket,
        roomID: state.chat.roomID,
        avatar: state.auth.avatar,
        channelID: state.chat.channelID,
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        roomName: state.chat.roomName,
    }
}

export default connect(mapStateToProps, actions)(Channels);
