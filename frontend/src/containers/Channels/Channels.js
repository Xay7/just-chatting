import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Channels.module.scss';
import { isFetching, changeChannel, getChatMessages, newChannel } from '../../store/actions/index';
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
            selectedChannel: ''
        }

        this.socket = this.props.socketChat;


    }

    componentDidMount() {
        if (this.props.channels[0]) {
            this.switchChannel(this.props.channels[0].id, this.props.channels[0].name, this.props.channels[0].description);
        }
    }

    componentDidUpdate(prevProps) {
        // Initial channel join
        if (prevProps.roomID !== this.props.roomID && this.props.channels[0]) {
            return this.switchChannel(this.props.channels[0].id, this.props.channels[0].name, this.props.channels[0].description);
        }
        // Check if channel is deleted and automatically join first one
        if (this.props.channels.length < prevProps.channels.length && this.props.channels[0]) {
            return this.switchChannel(this.props.channels[0].id, this.props.channels[0].name, this.props.channels[0].description);
        }
        // Auto join when there's no channels and user add new one
        if (prevProps.channels.length === 0 && this.props.channels.length > 0) {
            return this.switchChannel(this.props.channels[0].id, this.props.channels[0].name, this.props.channels[0].description);
        }
    }

    switchChannel = async (id, name, description) => {

        await this.props.isFetching();

        const previousChannel = this.state.selectedChannel

        let data = {
            channel_id: id,
            skipMessages: 0
        }

        this.setState({ selectedChannel: id });

        await this.props.changeChannel(id, name, description);
        await this.props.getChatMessages(data);

        this.socket.emit('JOIN_CHANNEL', {
            channelID: id,
            previousChannelID: previousChannel,
            name: this.props.username,
            avatar: this.props.avatar
        })
    }


    addChannel = async () => {

        if (!this.state.channelName) {
            return console.log("can't be empty");
        }

        let data = {
            username: this.props.username,
            id: this.props.roomID,
            name: this.state.channelName,
            description: this.state.channelDescription
        }

        await this.props.newChannel(data);

        this.showAddChannel();

        this.setState({
            channelName: '',
            channelDescription: '',
        })

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
            return <div key={el.id} className={this.currentChannelStyle(el.id)}>
                <button
                    onClick={() => this.switchChannel(el.id, el.name, el.description)}
                    disabled={this.currentChannelDisable(el.id)}
                >{"# " + el.name}</button>
            </div>
        });

        let addChannel = null;
        let noChannels = null;

        if (this.props.channels.length === 0) {
            noChannels = <div className={styles.NoChannel}>
                <div className={styles.NoChannelsTextWrapper}>
                    <h1>Waiting to join a channel</h1>
                    <p>You can add channels by pressing plus button</p>
                </div>
            </div>
        }

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
                            AutoComplete="off"
                            ClassName={this.props.errorMessage ? "InputError" : "Input"}
                        >Room Name</ChatInput>
                        <ChatInput
                            Type="text"
                            OnChange={this.channelDescriptionHandler}
                            Placeholder="Tell others what is this channel about"
                            ID="channelDescription"
                            AutoComplete="off"
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
                    {noChannels}
                    <div className={styles.ChannelsHeader}>
                        <h3 className={styles.ChannelTitle}>Channels</h3>
                        {this.props.roomName ? <button onClick={this.showAddChannel} className={styles.AddChannel}>+</button> : null}
                    </div>
                    <div className={styles.ChannelsList}>
                        {channels}
                    </div>
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
        skip: state.chat.skip,
        loading: state.chat.loading
    }
}

const mapDispatchToProps = {
    isFetching,
    changeChannel,
    getChatMessages,
    newChannel
}


export default connect(mapStateToProps, mapDispatchToProps)(Channels);
