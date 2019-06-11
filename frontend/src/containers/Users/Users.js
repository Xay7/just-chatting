import React, { Component } from 'react';
import styles from './Users.module.scss';
import { connect } from 'react-redux';
import Loader from '../../components/Loader/Loader';

class Users extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            subscribers: []
        }

        this.socket = this.props.socketChat;

        this.socket.on('ROOM_USER_LIST', (data) => {
            this.setState({ users: data });
        })

        this.socket.on('USER_LOGGED_IN', (data) => {

            const userExists = this.state.users.some(el => {
                return el.username === data.username;
            })

            if (userExists) {
                return;
            }

            this.setState({ users: [...this.state.users, data] })
        })

        this.socket.on('USER_DISCONNECTED', data => {
            let updatedUsers = this.state.users.filter(el => {
                return el.username !== data
            })
            this.setState({ users: updatedUsers });
        })

    }

    render() {

        let connectedUsers = this.state.users.map(user => {
            return (
                <div className={styles.UserWrapper} key={user.username}>
                    <img src={user.avatar} alt={user.username + " avatar"} className={styles.Avatar} s />
                    <p className={styles.User} key={user.username}>{user.username}</p>
                </div>
            )
        })

        let subscribers = null;

        if (this.props.loading) {
            subscribers = <Loader />
        } else subscribers = this.props.subscribers.map(data => {
            const isOnline = this.state.users.some((el) => {
                return el.username === data.subscriber;
            })
            if (isOnline) {
                return null;
            } else return (
                <div className={styles.UserWrapper} key={data.subscriber}>
                    <img src={data.avatar} alt={data.avatar + " avatar"} className={styles.Avatar} />
                    <div>{data.subscriber}</div>
                </div>
            )
        })

        return (
            <React.Fragment>
                {!this.props.roomID || this.props.channels.length === 0 ? null :
                    <div className={styles.Users}>
                        <h5 className={styles.UserRole}>Online</h5>
                        {connectedUsers}
                        <h5 className={styles.UserRole}>Offline</h5>
                        {subscribers}
                    </div>
                }
            </React.Fragment>
        )
    }
}



const mapStateToProps = state => {
    return {
        name: state.auth.name,
        socketChat: state.auth.socket,
        room: state.auth.room,
        subscribers: state.chat.subscribers,
        roomOwner: state.chat.roomOwner,
        channel: state.chat.channelID,
        loading: state.chat.loading,
        roomID: state.chat.roomID,
        channels: state.chat.channels
    }

}

export default connect(mapStateToProps)(Users);