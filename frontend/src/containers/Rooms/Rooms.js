import React, { Component } from 'react';
import styles from './Rooms.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/chatroom';
import uuid4 from 'uuid4';
import Modal from '../../components/Modal/Modal';
import Options from '../../components/Options/Options';
import ChatInput from '../../components/ChatInput/ChatInput';
import Button from '../../components/Button/Button';


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

        this.changeChatroom = async (roomID, roomName, roomChannels, roomOwner) => {

            this.props.isFetching();

            this.setState({ selectedRoom: roomID });

            let data = {
                id: roomID,
                username: this.props.username,
                roomName: roomName,
                roomChannels: roomChannels,
                roomOwner: roomOwner
            }

            await this.props.changeRoom(data);

            await this.socket.emit('CHANGE_ROOM', {
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

        let data = {
            id: uuid4(),
            name: name,
            owner: this.props.username
        }

        await this.props.newChatroom(data);

        this.setState({
            chatRooms: this.props.chatRooms,
            showAdd: false,
        });

        this.socket.emit('NEW_ROOM', {
            roomID: data.id,
            username: this.props.username,
            avatar: this.props.avatar
        });

    }

    joinRoom = async () => {
        // Replace later with modal input
        const id = this.state.chatRoomId

        let data = {
            id: id,
            username: this.props.username
        }

        await this.props.joinRoom(data);

        await this.setState({
            chatRooms: this.props.chatRooms,
            showJoin: false
        })

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
        await this.props.updateRooms(this.props.username);

        const roomIDs = this.props.chatRooms.map(el => {
            return el.id
        })

        const data = {
            roomIDs: roomIDs,
            username: this.props.username,
            avatar: this.props.avatar
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


    render() {

        let chatRooms = this.props.chatRooms.map(room => {
            return <div key={room.id}>
                <button
                    className={this.currentRoomStyle(room.id)}
                    onClick={() => this.changeChatroom(room.id, room.name, room.channels, room.owner)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name.charAt(0)}
                </button>
            </div>
        })

        let addOrJoin = null;
        let noChannels = !this.props.roomID;

        if (!this.props.roomID) {
            noChannels = <div className={styles.NoRooms}>
                <div className={styles.NoRoomsTextWrapper}>
                    <h1>Waiting to join a room</h1>
                    <p>You can join or add room at the left sidebar</p>
                </div>
            </div>
        } else noChannels = null;


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
                {noChannels}
                <div className={styles.Rooms}>
                    {chatRooms}
                    <button
                        onClick={this.showAddorJoin}
                        className={styles.AddChatroom}>
                        +</button>
                </div>
                {addOrJoin}
            </React.Fragment>

        )
    }
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        chatRooms: state.chat.chatRooms,
        socketChat: state.auth.socket,
        channelID: state.chat.channelID,
        updateRooms: state.chat.updateRooms,
        roomID: state.chat.roomID,
        avatar: state.auth.avatar
    }
}

export default connect(mapStateToProps, actions)(Rooms);