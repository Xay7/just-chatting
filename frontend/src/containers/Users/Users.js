import React, { Component } from 'react';
import styles from './Users.module.scss';
import { connect } from 'react-redux';
import { socketChat } from '../Chat/Chat';

class Users extends Component {

    constructor(props) {
        super(props);

        this.state = {
            names: [],
        }

        this.socket = socketChat;

        this.sendMessage = e => {
            this.socket.emit('UPDATE_USERS', {
                name: this.props.name
            })
        }

        this.socket.on('UPDATING_USERS', (data) => {
            this.setState({ names: data })
        })
    }

    componentDidMount() {
        this.sendMessage();
    }

    render() {

        let users = this.state.names.map(user => {
            return (
                <p className={styles.User}>{user}</p>
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
        name: state.auth.name
    }

}

export default connect(mapStateToProps)(Users);