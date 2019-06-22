import React, { Component } from 'react';
import styles from './RoomSettings.module.scss';
import { connect } from 'react-redux';
import { deleteChatroom, leaveChatroom, showRoomOptions } from '../../store/actions/index';
import Modal from '../../components/Modal/Modal';
import Confirm from '../../components/Confirm/Confirm';
import Options from '../../components/Options/Options';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export class RoomSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showconfirmAction: false,
            showLeaveBox: false,
            showInviteString: false,
            copiedInviteString: false,
        }

        this.socket = this.props.socketChat;
    }

    deleteRoomHandler = () => {
        this.setState({ showconfirmAction: !this.state.showconfirmAction })
    }

    deleteRoom = async id => {
        await this.props.deleteChatroom(id);
        this.setState({ showconfirmAction: !this.state.showconfirmAction })
    }

    leaveRoomHandler = () => {
        this.setState({ showLeaveBox: !this.state.showLeaveBox })
    }

    leaveRoom = async id => {
        await this.props.leaveChatroom(id);
        this.setState({ showLeaveBox: !this.state.showLeaveBox })
        this.socket.emit('USER_LEFT', {
            room_id: this.props.room_id,
            user_id: this.props.user_id
        })
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    hideconfirmAction = () => {
        this.setState({ showconfirmAction: false });
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

        if (this.state.showconfirmAction || this.state.showLeaveBox || this.state.showInviteString) {
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

    copiedInviteString = () => {
        this.setState({ copiedInviteString: true });
    }

    render() {

        let confirmAction = null;
        let inviteString = null;

        if (this.state.showconfirmAction) {
            confirmAction = <React.Fragment>
                <Modal onclick={this.deleteRoomHandler} />
                <Confirm
                    cancel={this.hideconfirmAction}
                    confirm={() => this.deleteRoom(this.props.room_id)}
                    header={`Delete ${this.props.roomName}`}
                    description={`Are you sure you want to delete ${this.props.roomName}?`}
                />
            </React.Fragment>
        }

        if (this.state.showLeaveBox) {
            confirmAction = <React.Fragment>
                <Modal onclick={this.leaveRoomHandler} />
                <Confirm
                    cancel={this.hideconfirmAction}
                    confirm={() => this.leaveRoom(this.props.room_id)}
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
                            <input value={this.props.room_id} disabled className={styles.InviteInput} />
                            <CopyToClipboard text={this.props.room_id}>
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
                {confirmAction}
                {inviteString}
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
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        user_id: state.auth.user_id,
        roomOwner: state.chat.roomOwner,
        room_id: state.chat.roomID,
        roomName: state.chat.roomName,
        showOptions: state.chat.showRoomOptions,
        socketChat: state.auth.socket,
    }
}

const mapDispatchToProps = {
    deleteChatroom,
    leaveChatroom,
    showRoomOptions
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomSettings);
