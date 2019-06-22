import React, { Component } from 'react';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import Confirm from '../../components/Confirm/Confirm';
import Modal from '../../components/Modal/Modal';
import Options from '../../components/Options/Options';
import Radium from 'radium';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Channels from '../Channels/Channels'
import {
    deleteChatroom,
    showRoomOptions,
    clearFetchMessage,
    leaveChatroom
} from '../../store/actions/index';
import UserSettings from '../UserSettings/UserSettings'

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDeleteBox: false,
            showLeaveBox: false,
            showInviteString: false,
            copiedInviteString: false,
            showUserSettings: false,
            fileUploaded: false
        }

        this.socket = this.props.socketChat;
    }

    deleteRoomHandler = () => {
        this.setState({ showDeleteBox: !this.state.showDeleteBox })
    }

    deleteRoom = async id => {
        await this.props.deleteChatroom(id);
        this.setState({ showDeleteBox: !this.state.showDeleteBox })
    }

    leaveRoomHandler = () => {
        this.setState({ showLeaveBox: !this.state.showLeaveBox })
    }

    leaveRoom = async id => {
        await this.props.leaveChatroom(id);
        this.setState({ showLeaveBox: !this.state.showLeaveBox })
        this.socket.emit('USER_LEFT', this.props.user_id)
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    hideDeleteBox = () => {
        this.setState({ showDeleteBox: false });
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

    showInviteHandler = (e) => {
        this.setState({
            showInviteString: !this.state.showInviteString,
            copiedInviteString: false
        })
    }

    showUserSettings = (e) => {
        this.props.clearFetchMessage();
        this.setState({
            showUserSettings: !this.state.showUserSettings,
            fileUploaded: false,
            avatarError: '',
            avatarSuccess: '',
            avatar: ''
        })
    }

    copiedInviteString = () => {
        this.setState({ copiedInviteString: true });
    }

    render() {

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
                    {/* Render delete room only to the owner, else render leave room */}
                    {this.props.roomOwner.id === this.props.user_id ?
                        <div className={styles.OptionsBtnRed} onClick={this.deleteRoomHandler}>
                            <div className={styles.IconsWrapper}>
                                <i className="fas fa-trash-alt "></i>
                            </div>
                            <div className={styles.OptionsDescription}>
                                Delete room
                            </div>
                        </div>
                        :
                        <div className={styles.OptionsBtnRed} onClick={this.leaveRoomHandler}>
                            <div className={styles.IconsWrapper}>
                                <i className="fas fa-door-open"></i>
                            </div>
                            <div className={styles.OptionsDescription}>
                                Leave room
                            </div>

                        </div>}
                </div>
            )

        let deleteBox = null;
        let inviteString = null;
        let userSettings = null;

        if (this.state.showDeleteBox) {
            deleteBox = <React.Fragment>
                <Modal onclick={this.deleteRoomHandler} />
                <Confirm
                    cancel={this.hideDeleteBox}
                    confirm={() => this.deleteRoom(this.props.roomID)}
                    header={`Delete ${this.props.roomName}`}
                    description={`Are you sure you want to delete ${this.props.roomName}?`}
                />
            </React.Fragment>
        }

        if (this.state.showLeaveBox) {
            deleteBox = <React.Fragment>
                <Modal onclick={this.leaveRoomHandler} />
                <Confirm
                    cancel={this.hideDeleteBox}
                    confirm={() => this.leaveRoom(this.props.roomID)}
                    header={`Leave ${this.props.roomName}`}
                    description={`Are you sure you want to leave ${this.props.roomName}?`}
                />
            </React.Fragment>
        }

        if (this.state.showInviteString) {
            inviteString = <React.Fragment>
                <Modal onclick={this.showInviteHandler} />
                <Options>
                    <div className={styles.InviteString}>
                        <h3 style={{ marginTop: "10px" }}>Share this room ID with friends</h3>
                        <div className={styles.InputWithBtn}>
                            <input value={this.props.roomID} disabled className={styles.InviteInput} />
                            <CopyToClipboard text={this.props.roomID}>
                                <button className={styles.Copy} onClick={this.copiedInviteString}>Copy</button>
                            </CopyToClipboard>
                        </div>
                        {this.state.copiedInviteString ? <p style={{ margin: 0 }}>Copied <span role="img" aria-label="thumbs up">👍</span></p> :
                            <span style={{ margin: 0, display: "none" }}>Copied <span role="img" aria-label="thumbs up">👍</span></span>}
                    </div>
                </Options>
            </React.Fragment>
        }

        return (
            <React.Fragment>
                {deleteBox}
                {inviteString}
                {this.state.showUserSettings && <UserSettings toggleDisplay={this.showUserSettings} />}
                <div className={styles.Sidebar}>
                    {roomOptions}
                    {this.props.roomID && <Channels />}
                    <div className={styles.User}>
                        <img src={this.props.avatar} alt={this.props.username + " avatar"} className={styles.Avatar} />
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

const mapStateToProps = state => {
    return {
        chatRooms: state.chat.chatRooms,
        username: state.auth.username,
        user_id: state.auth.user_id,
        socketChat: state.auth.socket,
        roomID: state.chat.roomID,
        roomName: state.chat.roomName,
        showOptions: state.chat.showRoomOptions,
        avatar: state.auth.avatar,
        roomOwner: state.chat.roomOwner,
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage
    }
}

const mapDispatchToProps = {
    deleteChatroom,
    showRoomOptions,
    clearFetchMessage,
    leaveChatroom
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Sidebar));