import React, { Component } from 'react';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/chatroom';
import * as authActions from '../../store/actions/auth';
import uuid4 from 'uuid4'
import Confirm from '../../components/Confirm/Confirm';
import Modal from '../../components/Modal/Modal';
import Options from '../../components/Options/Options';
import Radium from 'radium';
import DefaultAvatar from '../../assets/default_user_avatar.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ChatInput from '../../components/ChatInput/ChatInput';
import Button from '../../components/Button/Button';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedChannel: '',
            showDeleteBox: false,
            showAddChannel: false,
            showInviteString: false,
            showUserSettings: false,
            channelName: '',
            channelDescription: '',
            password: '',
            confirmPassword: '',
            avatar: ''
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

    deleteRoomHandler = () => {
        this.setState({ showDeleteBox: !this.state.showDeleteBox })
    }

    deleteRoom = async (id, username) => {

        this.setState({ showDeleteBox: !this.state.showDeleteBox })

        const data = {
            id: id,
            username: username
        }

        await this.props.deleteRoom(data);

        this.socket.emit('OWNER_DELETED_ROOM', data);

    }


    currentChannelStyle = (index) => {
        const isSelected = this.props.channelID === index;
        return isSelected ? styles.ChannelSelected : styles.Channel
    }

    currentChannelDisable = (index) => {
        const isSelected = this.props.channelID === index;
        return isSelected ? true : false;
    }

    hideDeleteBox = () => {
        this.setState({ showDeleteBox: false })
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = (e) => {

        if (this.props.showOptions) {
            if (this.node.contains(e.target)) {
                return;
            }
        }

        if (e.target.parentNode.children[0].className.substring(0, 16) === "RoomHelpers_Room") {
            return;
        }


        if (this.state.showDeleteBox) {
            return;
        }

        if (this.props.showOptions === true) {
            this.props.showRoomOptions();
        }

    }

    uploadFile = (e) => {
        const avatar = e.target.files[0]
        this.setState({ avatar: avatar })
    }

    changePassword = (e) => {
        this.setState({ password: e.target.value })
    }


    confirmPassword = (e) => {
        this.setState({ confirmPassword: e.target.value })
    }


    submitAvatar = (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (this.state.avatar === '') {
            return console.log("No picture provided")
        }

        formData.append('avatar', this.state.avatar);

        this.props.updateAvatar(formData);
    }

    submitPassword = (e) => {
        e.preventDefault();

        if (this.state.password === '') {
            return console.log("No password provided");
        }

        if (this.state.password !== this.state.confirmPassword) {
            return console.log("Passwords are not equal")
        }

        if (this.state.password.length < 6) {
            console.log("Password must be longer than 6 characters");
        }

        const data = {
            username: this.props.username,
            newPassword: this.state.password
        }

        this.props.updatePassword(data);
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

    showInviteHandler = (e) => {
        this.setState({ showInviteString: !this.state.showInviteString });
    }

    showUserSettings = (e) => {
        this.setState({ showUserSettings: !this.state.showUserSettings })
    }



    render() {

        let channels = this.props.channels.map(el => {
            return <div style={{ color: "white" }} key={el.id} className={styles.ChannelWrapper}>
                <button
                    onClick={() => this.switchChannel(el.id, el.name, el.description)}
                    disabled={this.currentChannelDisable(el.id)}
                    className={this.currentChannelStyle(el.id)}
                >{"# " + el.name}</button>
            </div>
        });

        let roomOptions = this.props.showOptions &&
            (
                <div className={styles.Options} ref={node => this.node = node} >
                    <div className={styles.OptionsBtn}>
                        <div className={styles.IconsWrapper}>
                            <i className="fas fa-user-plus "></i>
                        </div>
                        <div className={styles.OptionsDescription} onClick={this.showInviteHandler}>
                            Invite people
                            </div>
                    </div>
                    {/* Render delete room only to the owner */}
                    {this.props.roomOwner === this.props.username ? <div className={styles.OptionsBtnRed} onClick={this.deleteRoomHandler}>
                        <div className={styles.IconsWrapper}>
                            <i className="fas fa-trash-alt "></i>
                        </div>
                        <div className={styles.OptionsDescription}>
                            Delete room
                            </div>

                    </div> : null}
                </div>
            )



            ;

        let addChannel = null

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
                        >Room Name</ChatInput>
                        <ChatInput
                            Type="text"
                            OnChange={this.channelDescriptionHandler}
                            Placeholder="Tell others what is this channel about"
                            ID="channelDescription"
                            autoComplete="off"
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
                {this.state.showDeleteBox ?
                    <React.Fragment>
                        <Modal onclick={this.hideDeleteBox} />
                        <Confirm
                            cancel={this.hideDeleteBox}
                            confirm={() => this.deleteRoom(this.props.roomID, this.props.username)}
                            header={`Delete ${this.props.roomName}`}
                            description={`Are you sure you want to delete ${this.props.roomName}?`}
                        />
                    </React.Fragment> : null}
                {this.state.showInviteString ?
                    <React.Fragment>
                        <Modal onclick={this.showInviteHandler} />
                        <Options>
                            <div className={styles.InviteString}>
                                <h3 style={{ marginTop: "10px" }}>Share this room ID with friends</h3>
                                <div className={styles.InputWithBtn}>
                                    <input value={this.props.roomID} disabled className={styles.InviteInput} />
                                    <CopyToClipboard text={this.props.roomID}>
                                        <button className={styles.Copy}>Copy</button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        </Options>
                    </React.Fragment> : null}
                {this.state.showUserSettings ?
                    <React.Fragment>
                        <Modal onclick={this.showUserSettings} />
                        <Options>
                            <div className={styles.UserSettings}>
                                {this.props.avatar ? <img src={this.props.avatar} alt={this.props.username + "avatar"} className={styles.Avatar} /> :
                                    <img src={DefaultAvatar} alt={this.props.username + " avatar"} className={styles.Avatar} />}
                                <input
                                    type="file"
                                    onChange={this.uploadFile}
                                    accept="image/*" />
                                <Button ClassName="Confirm" OnClick={this.submitAvatar}>Confirm</Button>
                                <form onSubmit={this.submitPassword}>
                                    <input type="password" onChange={this.changePassword} autoComplete="true" />
                                    <input type="password" onChange={this.confirmPassword} autoComplete="true" />
                                    <Button ClassName="Confirm" OnClick={this.submitPassword}>Confirm</Button>
                                </form>
                            </div>
                        </Options>
                    </React.Fragment> : null}

                {addChannel}
                <div className={styles.Sidebar}>
                    {roomOptions}

                    <div className={styles.Channels}>
                        <div className={styles.ChannelsHeader}>
                            <h3 className={styles.ChannelTitle}>Channels</h3>
                            {this.props.roomName ? <button onClick={this.showAddChannel} className={styles.AddChannel}>+</button> : null}
                        </div>
                        {channels}
                    </div>
                    <div className={styles.User}>
                        {this.props.avatar ? <img src={this.props.avatar} alt={this.props.username + "avatar"} className={styles.Avatar} /> :
                            <img src={DefaultAvatar} alt={this.props.username + "avatar"} className={styles.Avatar} />}
                        <p style={{ color: 'white' }}>{this.props.username}</p>
                        <i
                            className="fas fa-cog fa-lg"
                            style={{
                                position: "absolute",
                                right: "0",
                                marginRight: "20px",
                                color: "white",
                                ':hover': {
                                    color: '#BBB',
                                    cursor: 'pointer'
                                },
                            }}
                            onClick={this.showUserSettings}></i>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

const mapDispatchToProps = {
    ...actions,
    ...authActions
}

const mapStateToProps = state => {
    return {
        chatRooms: state.chat.chatRooms,
        username: state.auth.username,
        socketChat: state.auth.socket,
        roomID: state.chat.roomID,
        channels: state.chat.channels,
        roomName: state.chat.roomName,
        showOptions: state.chat.showRoomOptions,
        channelID: state.chat.channelID,
        avatar: state.auth.avatar,
        roomOwner: state.chat.roomOwner
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Sidebar));