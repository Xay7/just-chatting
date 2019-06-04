import React, { Component } from 'react';
import styles from './Users.module.scss';
import { connect } from 'react-redux';
import DefaultAvatar from '../../assets/default_user_avatar.png';

class Users extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
        }

        this.socket = this.props.socketChat;

        this.socket.on('UPDATING_USERS', (data) => {
            this.setState({ users: data });
        })

        this.socket.on('LEFT_ROOM', () => {
            this.setState({
                users: []
            })
        })
    }


    render() {

        let connectedUsers = this.state.users.map(user => {
            console.log(user);
            return (
                <div className={styles.UserWrapper}>
                    {user.avatar ? <img src={user.avatar} alt={user.username + "avatar"} className={styles.Avatar} /> :
                        <img src={DefaultAvatar} alt={user.username + "avatar"} className={styles.Avatar} />}
                    <p className={styles.User} key={user.username}>{user.username}</p>

                </div>
            )
        })


        return (
            <div className={styles.Users}>
                {connectedUsers}
            </div>
        )
    }
}



const mapStateToProps = state => {
    return {
        name: state.auth.name,
        socketChat: state.auth.socket,
        room: state.auth.room
    }

}

export default connect(mapStateToProps)(Users);