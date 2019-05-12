import React, { Component } from 'react';
import styles from './Chatbox.module.scss';
import io from 'socket.io-client';
import { connect } from 'react-redux';

class Chatbox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            messages: [],
            sameUserMessage: false,
        };

        this.socket = io('localhost:3001');

        this.sendMessage = e => {
            this.socket.emit('SEND_MESSAGE', {
                username: this.props.name,
                message: this.state.message
            })
        }

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        const addMessage = data => {

            if (this.state.messages.length > 0) {
                if (data.username === this.state.messages.slice(-1)[0].username) {
                    this.setState({ sameUserMessage: true })
                }
                else {
                    this.setState({ sameUserMessage: false })
                }
            }

            this.setState({
                messages: [...this.state.messages, data],
            });

        };


    }

    enterHandler = (e) => {
        console.log(e.target.value);
        if (e.keyCode === 13 && this.state.message !== '') {
            this.sendMessage();
            this.setState({ message: '' });
        }
    }

    onChangeHandler = (e) => {
        this.setState({ message: e.target.value })
    }

    render() {

        // Makes messages continue on current user

        let messages = this.state.messages.map((message, index, arr) => {
            if (index > 0) {
                if (message.username === arr[index - 1].username) {
                    return (
                        <div className={styles.Messages} key={index}>
                            <div className={styles.Message}>{message.message}</div>
                        </div>
                    )
                }
                else {
                    return (
                        <div className={styles.Messages} key={index}>
                            <hr className={styles.MessageHorizontalLine}></hr>
                            <div>
                                <p className={styles.Username}>{message.username}</p>
                            </div>
                            <div className={styles.Message}>{message.message}</div>
                        </div>
                    )
                };
            }
            else {
                return (
                    <div className={styles.Messages} key={index}>
                        <hr className={styles.MessageHorizontalLine}></hr>
                        <div>
                            <p className={styles.Username}>{message.username}</p>
                        </div>
                        <div className={styles.Message}>{message.message}</div>
                    </div>
                )
            }
        })


        return (
            <div className={styles.Chatbox}>
                <div className={styles.MessagesContainer}>
                    {messages}
                </div>
                <div className={styles.InputContainer}>
                    <input type="text"
                        onKeyDown={this.enterHandler}
                        placeholder="Enter your message"
                        className={styles.MessageInput}
                        value={this.state.message}
                        onChange={this.onChangeHandler} />
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        name: state.auth.name
    }
}

export default connect(mapStateToProps)(Chatbox);