import React, { Component } from 'react';
import styles from './Chatbox.module.scss';
import { connect } from 'react-redux';
import moment from 'moment';
import * as actions from '../../store/actions/chatroom';
import UserTyping from '../../components/UserTyping/UserTyping';


class Chatbox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            messages: [],
            sameUserMessage: false,
            typing: false,
            typingTimeout: 0
        };

        this.socket = this.props.socketChat;

        this.sendMessage = async e => {

            let socketData = {
                author: this.props.username,
                body: this.state.message,
                created_at: moment().calendar(null),
                room: this.props.channelID,
                avatar: this.props.avatar
            }

            this.socket.emit('SEND_MESSAGE', socketData)

            let dbData = {
                author: this.props.username,
                body: this.state.message,
                room: this.props.roomID,
                channelID: this.props.channelID,
                created_at: moment(),
                avatar: this.props.avatar
            }

            await this.props.storeMessage(dbData);

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
            this.scrollToBottom()
        });

        this.socket.on('LEFT_ROOM', () => {
            this.setState({
                message: '',
                messages: [],
                sameUserMessage: false,
            })
        })

        this.socket.on('SOMEONE_IS_TYPING', () => {


            if (this.state.typingTimeout) {
                clearTimeout(this.state.typingTimeout);
            }

            this.setState({
                typing: true,
                typingTimeout: setTimeout(() => {
                    this.setState({ typing: false })
                }, 2000)
            })

            this.scrollToBottom();


        })


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
                messages: [...this.state.messages, data], typing: false
            });

            this.scrollToBottom()

        };


    }

    // Remove after css is done

    componentDidMount() {
        this.setState({ messages: this.props.messages })
    }

    enterHandler = async (e) => {
        if (e.keyCode === 13 && this.state.message !== '') {
            await this.sendMessage();
            await this.setState({ message: '', typing: false });
            this.scrollToBottom();
        }

    }
    onChangeHandler = (e) => {

        this.socket.emit('CLIENT_IS_TYPING', {
            room: this.props.channelID
        })

        this.setState({
            message: e.target.value,
        })
    }

    scrollToBottom() {
        const scrollHeight = this.messageContainer.scrollHeight;
        const height = this.messageContainer.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messageContainer.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    isUrl = string => {
        const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\\/]))?/
        return regexp.test(string);
    }

    isImage = string => {
        const regexp = /\.(gif|jpg|jpeg|tiff|png)$/i
        return regexp.test(string);
    }

    adjustImage = ({ target: img }) => {
        if (img.naturalHeight > 512 || img.naturalWidth > 512) {
            img.style.maxWidth = "100%";
            img.style.height = "auto";
            img.style.margin = "10px 0";
        }
    }


    render() {

        let messages = this.state.messages.map((message, index, arr) => {
            if (index > 0) {

                if (this.isUrl(message.body) === true) {
                    if (this.isImage(message.body) === true) {

                        message.body = (
                            <div className={styles.Messages}>
                                <a href={message.body} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={message.body}
                                        alt={message.body}
                                        onLoad={this.adjustImage}
                                    />
                                </a>
                            </div>
                        )

                    } else message.body = <a href={message.body} target="_blank" rel="noopener noreferrer" className={styles.Link}>{message.body}</a>
                }



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
                            <div className={styles.MessageHeader}>
                                <img src={message.avatar} alt={this.props.username + "avatar"} className={styles.Avatar} />
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
                        <div className={styles.MessageHeader}>
                            <img src={message.avatar} alt={this.props.username + "avatar"} className={styles.Avatar} />
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
                <div className={styles.MessagesContainer} ref={(div) => {
                    this.messageContainer = div;
                }}>
                    {messages}
                    {this.state.typing ? <UserTyping /> : null}
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
        messages: state.chat.messages,
        channelID: state.chat.channelID,
        avatar: state.auth.avatar
    }
}

export default connect(mapStateToProps, actions)(Chatbox);