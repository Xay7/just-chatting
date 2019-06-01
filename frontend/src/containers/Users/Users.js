import React, { Component } from 'react';
import styles from './Users.module.scss';
import { connect } from 'react-redux';

class Users extends Component {

    constructor(props) {
        super(props);

        this.state = {
            names: [],
        }

        this.socket = this.props.socketChat;

        this.socket.on('UPDATING_USERS', (data) => {
            this.setState({ names: data })
        })

        this.socket.on('LEFT_ROOM', () => {
            this.setState({
                names: []
            })
        })
    }


    render() {

        let users = this.state.names.map(user => {
            return (
                <p className={styles.User} key={user}>{user}</p>
            )
        })

        return (
            <div className={styles.Users}>
                {users}
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