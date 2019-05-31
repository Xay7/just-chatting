import React, { Component } from 'react';
import styles from './Rooms.module.scss';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/chatroom';
import uuid4 from 'uuid4';
import Modal from '../../components/Modal/Modal';
import Options from '../../components/Options/Options';


class Rooms extends Component {

    constructor(props) {
        super(props)

        this.state = {
            chatRooms: {
                owned: [],
                joined: []
            },
            selectedRoom: '',
            showAddOrJoin: false,
            showAdd: false,
            showJoin: false,
            chatRoomName: '',
            chatRoomId: '',
        }

        this.socket = this.props.socketChat;

        this.changeChatroom = async (roomID, roomName, roomChannels) => {

            this.setState({ selectedRoom: roomID });

            let data = {
                id: roomID,
                username: this.props.username,
                roomName: roomName,
                roomChannels: roomChannels
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

        let ownedChatrooms = this.state.chatRooms.owned.map(room => {
            return <div key={room.id}>
                <button
                    className={this.currentRoomStyle(room.id)}
                    onClick={() => this.changeChatroom(room.id, room.name, room.channels)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name}
                </button>
            </div>
        })

        let joinedChatrooms = this.state.chatRooms.joined.map(room => {
            return <div key={room.id}>
                <button
                    className={this.currentRoomStyle(room.id)}
                    onClick={() => this.changeChatroom(room.id, room.name, room.channels)}
                    disabled={this.currentRoomDisable(room.id)}>{room.name}
                </button>
            </div>
        })

        let addOrJoin = null;


        if (this.state.showAddOrJoin) {
            addOrJoin = <div >
                <Modal onclick={this.showAddorJoin} />
                <Options >
                    <div className={styles.Wrapper}>
                        <div className={styles.Add}>
                            <button onClick={this.showAdd}>ADD</button>
                        </div>
                        <div className={styles.Join}>
                            <button onClick={this.showJoin}>JOIN</button>
                        </div>
                    </div>
                </Options>
            </div>
        }

        if (this.state.showAdd) {
            addOrJoin = <div >
                <Modal onclick={this.showAdd} />
                <Options >
                    <div className={styles.Wrapper}>
                        <div>
                            <h1>Something about adding chatroom</h1>
                            <input type="text" onChange={this.roomNameHandler} />
                            <button onClick={this.addChatroom}>Submit</button>
                        </div>
                        <div>
                            <button onClick={this.showAddorJoin}>GO BACK</button>
                        </div>
                    </div>

                </Options>
            </div>;
        }

        if (this.state.showJoin) {
            addOrJoin = <div >
                <Modal onclick={this.showJoin} />
                <Options >
                    <div className={styles.Wrapper}>
                        <div>
                            <h1>Something about joining chatroom</h1>
                            <input type="text" onChange={this.roomIdHandler} />
                            <button onClick={this.joinRoom}>Submit</button>
                        </div>
                        <div>
                            <button onClick={this.showAddorJoin}>GO BACK</button>
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
        channelID: state.chat.channelID
    }
}

export default connect(mapStateToProps, actions)(Rooms);