import React, { Component } from 'react';
import styles from './Rooms.module.scss';
import { connect } from 'react-redux';
import { newChatroom, updateRooms, changeRoom, joinRoom, Logout } from '../../store/actions/index';
import Modal from '../../components/Modal/Modal';
import Options from '../../components/Options/Options';
import ChatInput from '../../components/ChatInput/ChatInput';
import Button from '../../components/Button/Button';
import { withRouter } from 'react-router-dom';


class Rooms extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedRoom: '',
            showAddOrJoin: false,
            showAdd: false,
            showJoin: false,
            chatRoomName: '',
            chatRoomId: '',
        }

        this.socket = this.props.socketChat;

        this.changeChatroom = async id => {

            const previousRoom = this.props.roomID;

            this.setState({ selectedRoom: id });

            await this.props.changeRoom(id);

            await this.socket.emit('CHANGE_ROOM', {
                previousRoom: previousRoom,
                roomID: this.props.roomID,
                username: this.props.username,
                avatar: this.props.avatar
            })
        }
    }


    addChatroom = async () => {

        const name = this.state.chatRoomName

        if (name === '') {
            return;
        }

        await this.props.newChatroom(name);

        this.setState({
            chatRooms: this.props.chatRooms,
            showAdd: false,
        });
        ;
        this.socket.emit('NEW_ROOM', {
            roomID: this.props.chatRooms.slice(-1)[0].id,
            username: this.props.username,
            avatar: this.props.avatar
        });

    }

    joinRoom = async () => {

        const id = this.state.chatRoomId

        const data = {
            id: id,
            user_id: this.props.user_id
        }

        await this.props.joinRoom(data);

        await this.setState({
            chatRooms: this.props.chatRooms,
            showJoin: false
        })

        this.socket.emit('JOIN_ROOM', {
            roomID: data.id,
            username: this.props.username,
            avatar: this.props.avatar
        });

    }

    showAddorJoin = () => {
        this.setState({
            showAddOrJoin: !this.state.showAddOrJoin,
            showAdd: false,
            showJoin: false
        })
    }

    showJoin = () => {
        this.setState({
            showJoin: !this.state.showJoin,
            showAddOrJoin: false,
            showAdd: false,

        })
    }

    showAdd = () => {
        this.setState({
            showAdd: !this.state.showAdd,
            showAddOrJoin: false,
            showJoin: false,
        })
    }


    async componentDidMount() {
        await this.props.updateRooms(this.props.user_id);

        const roomIDs = this.props.chatRooms.map(el => {
            return el.id
        })

        const data = {
            user_id: this.props.user_id,
            username: this.props.username,
            avatar: this.props.avatar,
            roomIDs: roomIDs,
        }

        this.socket.emit("USER_LOGGED_IN", data);
    }

    // Changes selected room styles for visual clarity
    currentRoomStyle = (index) => {
        const isSelected = this.state.selectedRoom === index;
        // True is room selected, rest are not
        return isSelected ? styles.RoomSelected : styles.RoomNotSelected;
    }
    // Disables click on currect room to prevent multiple socket calls
    currentRoomDisable = (index) => {
        const isSelected = this.state.selectedRoom === index;
        return isSelected ? true : false;
    }

    roomNameHandler = (e) => {
        this.setState({ chatRoomName: e.target.value });
    }

    roomIdHandler = (e) => {
        this.setState({ chatRoomId: e.target.value });
    }

    Logout = () => {
        this.props.history.push('/');
        this.props.Logout();
    }


    render() {

        let chatRooms = this.props.chatRooms.map(room => {
            return <div key={room.id}>
                <button
                    className={this.currentRoomStyle(room.id)}
                    onClick={() => this.changeChatroom(room.id)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name.charAt(0)}
                </button>
            </div>
        })

        let addOrJoin = null;
        let noRooms = !this.props.roomID;

        if (!this.props.roomID) {
            noRooms = <div className={styles.NoRooms}>
                <div className={styles.NoRoomsTextWrapper}>
                    <h1>Waiting to join a room</h1>
                    <p>You can add or join a room by pressing plus button</p>
                </div>
            </div>
        } else noRooms = null;


        if (this.state.showAddOrJoin) {
            addOrJoin = <div >
                <Modal onclick={this.showAddorJoin} />
                <Options >
                    <div className={styles.Wrapper}>
                        <div className={styles.JoinAndAdd}>
                            <h3>Create new room</h3>
                            <p className={styles.Description}>Make a new room and invite whoever you want to</p>
                            <button onClick={this.showAdd} className={styles.Btn}>Create</button>
                        </div>
                        <div className={styles.JoinAndAdd}>
                            <h3>Join existing room</h3>
                            <p className={styles.Description}>Grab room ID and simply enter it to join friends room</p>
                            <button onClick={this.showJoin} className={styles.Btn}>Join</button>
                        </div>
                    </div>
                </Options>
            </div>
        }

        if (this.state.showAdd) {
            addOrJoin = <div >
                <Modal onclick={this.showAdd} />
                <Options >
                    <div className={styles.AddJoinWrapper}>
                        <div className={styles.AddJoinDescription}>
                            <h3>Create your room</h3>
                        </div>
                        <ChatInput
                            Type="text"
                            OnChange={this.roomNameHandler}
                            Placeholder="Enter room name"
                            ID="room"
                            AutoComplete="off"
                            ClassName={this.props.errorMessage ? "InputError" : "Input"}
                        >Room Name</ChatInput>
                        <div className={styles.AddJoinBtns}>
                            <Button ClassName="Cancel" OnClick={this.showAddorJoin}>Cancel</Button>
                            <Button ClassName="Confirm" OnClick={this.addChatroom}>Submit</Button>
                        </div>
                    </div>
                </Options>
            </div>;
        }

        if (this.state.showJoin) {
            addOrJoin = <div >
                <Modal onclick={this.showJoin} />
                <Options >
                    <div className={styles.AddJoinWrapper}>
                        <div className={styles.AddJoinDescription}>
                            <h3>Join existing room</h3>
                        </div>
                        <ChatInput
                            Type="text"
                            OnChange={this.roomIdHandler}
                            Placeholder="Enter room ID"
                            ID="room"
                            AutoComplete="off"
                            ClassName={this.props.errorMessage ? "InputError" : "Input"}
                        >Room ID</ChatInput>
                        <div className={styles.AddJoinBtns}>
                            <Button ClassName="Cancel" OnClick={this.showAddorJoin}>Cancel</Button>
                            <Button ClassName="Confirm" OnClick={this.joinRoom}>Submit</Button>
                        </div>
                    </div>
                </Options>
            </div>;
        }



        return (
            <React.Fragment>
                {noRooms}
                <div className={styles.Rooms}>
                    {chatRooms}
                    <button
                        onClick={this.showAddorJoin}
                        className={styles.AddChatroom}>
                        +</button>
                    <div className={styles.LogoutWrapper}>
                        <i
                            class="fas fa-sign-out-alt fa-lg"
                            style={{
                                color: "white",
                                cursor: "pointer",
                            }}
                            onClick={this.Logout}></i>
                    </div>
                </div>
                {addOrJoin}
            </React.Fragment>

        )
    }
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        user_id: state.auth.user_id,
        chatRooms: state.chat.chatRooms,
        socketChat: state.auth.socket,
        channelID: state.chat.channelID,
        updateRooms: state.chat.updateRooms,
        roomID: state.chat.roomID,
        avatar: state.auth.avatar
    }
}

const mapDispatchToProps = {
    newChatroom,
    updateRooms,
    changeRoom,
    joinRoom,
    Logout
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Rooms));