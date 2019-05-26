import React, { Component } from 'react';
import styles from './Chatbox.module.scss';
import { connect } from 'react-redux';
import moment from 'moment';
import * as actions from '../../store/actions/chatroom';



class Chatbox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            messages: [],
            sameUserMessage: false,
        };

        this.socket = this.props.socketChat;

        this.sendMessage = async e => {

            let data = {
                author: this.props.username,
                body: this.state.message,
                room: this.props.roomID,
                created_at: moment()
            }

            let data2 = {
                author: this.props.username,
                body: this.state.message,
                room: this.props.roomID,
                created_at: moment().calendar(null)
            }

            this.socket.emit('SEND_MESSAGE', data2)

            this.props.storeMessage(data);


        }

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        this.socket.on('NEW_ROOM', (data) => {



            let messagesFormated = this.props.messages.map(el => {
                el.created_at = moment(el.created_at).calendar(null);
                return el;
            })
            this.setState({ room: data.room, messages: messagesFormated });
        });

        const addMessage = data => {
            if (this.state.messages.length > 0) {
                if (data.author === this.state.messages.slice(-1)[0].author) {
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
    enterHandler = async (e) => {
        if (e.keyCode === 13 && this.state.message !== '') {
            await this.sendMessage();
            await this.setState({ message: '', typing: false });

        }

    }

    onChangeHandler = async (e) => {
        await this.setState({
            message: e.target.value,
            typing: true
        })
    }

    render() {



        // Makes messages continue on current user


        let messages = this.state.messages.map((message, index, arr) => {
            if (index > 0) {

                if (message.author === arr[index - 1].author) {
                    return (
                        <div className={styles.Messages} key={index}>
                            <div className={styles.Message}>{message.body}</div>
                        </div>
                    )
                }
                else {
                    return (
                        <div className={styles.Messages} key={index}>
                            <hr className={styles.MessageHorizontalLine}></hr>
                            <div className={styles.NameAndDate}>
                                <p className={styles.Username}>{message.author}</p>
                                <p className={styles.Date}>{message.created_at}</p>
                            </div>
                            <div className={styles.Message}>{message.body}</div>
                        </div>
                    )
                };
            }
            else {
                return (
                    <div className={styles.Messages} key={index}>
                        <hr className={styles.MessageHorizontalLine}></hr>
                        <div className={styles.NameAndDate}>
                            <p className={styles.Username}>{message.author}</p>
                            <p className={styles.Date}>{message.created_at}</p>
                        </div>
                        <div className={styles.Message}>{message.body}</div>
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
        username: state.auth.username,
        users: state.auth.users,
        socketChat: state.auth.socket,
        roomID: state.chat.roomID,
        messages: state.chat.messages
    }
}

export default connect(mapStateToProps, actions)(Chatbox);