import React, { Component } from 'react';
import styles from './Users.module.scss';
import { connect } from 'react-redux';

class Users extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
        }

        this.socket = this.props.socketChat;
        // Fix socket staying when leaving
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
            return (
                <div className={styles.UserWrapper} key={user.username}>
                    <img src={user.avatar} alt={user.username + "avatar"} className={styles.Avatar} />
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