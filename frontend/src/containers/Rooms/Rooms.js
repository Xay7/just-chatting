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

            this.setState({ selectedRoom: roomID });

            let data = {
                id: roomID,
                username: this.props.username,
                roomName: roomName,
                roomChannels: roomChannels,
                roomOwner: roomOwner
            }

            await this.socket.emit('LEAVE_ROOM', {
                channelID: this.props.channelID
            })

            await this.props.changeRoom(data);

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
        this.setState({ chatRooms: this.props.chatRooms });
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

        let ownedChatrooms = this.props.chatRooms.owned.map(room => {
            return <div key={room.id}>
                <button
                    className={this.currentRoomStyle(room.id)}
                    onClick={() => this.changeChatroom(room.id, room.name, room.channels, room.owner)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name.charAt(0)}
                </button>
            </div>
        })

        let joinedChatrooms = this.props.chatRooms.joined.map(room => {
            return <div key={room.id}>
                <button
                    className={this.currentRoomStyle(room.id)}
                    onClick={() => this.changeChatroom(room.id, room.name, room.channels, room.owner)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name.charAt(0)}
                </button>
            </div>
        })

        let addOrJoin = null;


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
                            autoComplete="off"
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
                            autoComplete="off"
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
                <div className={styles.Rooms}>
                    {ownedChatrooms}
                    {joinedChatrooms}
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
        updateRooms: state.chat.updateRooms
    }
}

export default connect(mapStateToProps, actions)(Rooms);