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
            typingTimeout: 0,
            skipMessages: 50
        };

        this.socket = this.props.socketChat;

        this.sendMessage = async e => {

            let socketMessage = {
                author: this.props.username,
                body: this.state.message,
                created_at: moment().calendar(null),
                avatar: this.props.avatar,
                room: this.props.roomID
            }

            this.socket.emit('SEND_MESSAGE', socketMessage)

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

        this.socket.on('UPDATING_MESSAGES', (data) => {

            let messagesFormated = this.props.messages.map(el => {
                el.created_at = moment(el.created_at).calendar(null);
                return el;
            })
            this.setState({ room: data.room, messages: messagesFormated });
            this.scrollToBottom()
        });

        this.socket.on('CHANGED_ROOM', () => {
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
            if (this.state.length > 0) {
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

            if (this.state.messages === []) {
                return;
            }

            this.scrollToBottom()

        };


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
            channel: this.props.channelID
        })

        this.setState({
            message: e.target.value,
        })
    }

    scrollToBottom() {
        if (this.messageContainer === undefined) return;
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
        img.style.marginLeft = "62px";
        img.style.marginBottom = "5px";
        if (img.naturalHeight > 512 || img.naturalWidth > 512) {
            img.style.maxWidth = "100%";
            img.style.height = "auto";
        }
    }

    getMoreMessages = async () => {

        if (this.messageContainer.scrollTop === 0 && !this.props.noMessages) {

            let data = {
                channelID: this.props.channelID,
                roomID: this.props.roomID,
                username: this.props.username,
                skipMessages: this.props.skip
            }

            await this.props.getChatMessages(data)

            let messages = [...this.props.messages, ...this.state.messages];

            this.setState({
                messages: messages
            })

        }
    }


    render() {

        let messages = this.state.messages.map((data, index, arr) => {
            console.log(data);
            if (index > 0) {
                if (this.isUrl(data.body) === true) {
                    if (this.isImage(data.body) === true) {
                        return (
                            <div className={styles.Messages} key={index}>
                                <a href={data.body} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={data.body}
                                        alt={data.body}
                                        onLoad={this.adjustImage}
                                    />
                                </a>
                            </div>
                        )
                    } else return <a href={data.body} target="_blank" rel="noopener noreferrer" className={styles.Link} key={index}>{data.body}</a>
                }



                if (data.author === arr[index - 1].author) {
                    return (
                        <div className={styles.Messages} key={index}>
                            <div className={styles.Message}>{data.body}</div>
                        </div>
                    )
                }
                else {
                    return (
                        <div className={styles.Messages} key={index}>
                            <hr className={styles.MessageHorizontalLine}></hr>
                            <div className={styles.MessageHeader}>
                                <img src={data.avatar} alt={this.props.username + "avatar"} className={styles.Avatar} />
                                <p className={styles.Username}>{data.author}</p>
                                <p className={styles.Date}>{data.created_at}</p>
                            </div>
                            <div className={styles.Message}>{data.body}</div>
                        </div>
                    )
                };
            }
            else {
                return (
                    <div className={styles.Messages} key={index}>
                        <hr className={styles.MessageHorizontalLine}></hr>
                        <div className={styles.MessageHeader}>
                            <img src={data.avatar} alt={this.props.username + "avatar"} className={styles.Avatar} />
                            <p className={styles.Username}>{data.author}</p>
                            <p className={styles.Date}>{data.created_at}</p>
                        </div>
                        <div className={styles.Message}>{data.body}</div>
                    </div>
                )
            }
        })


        return (
            <React.Fragment>
                {!this.props.roomID || this.props.channels.length === 0 ? null :
                    <div className={styles.Chatbox}>
                        <div
                            className={styles.MessagesContainer}
                            ref={(div) => {
                                this.messageContainer = div;
                            }}
                            onScroll={this.getMoreMessages}>
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
                }
            </React.Fragment>
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
        avatar: state.auth.avatar,
        channels: state.chat.channels,
        skip: state.chat.skip,
        noMessages: state.chat.noMessages
    }
}

export default connect(mapStateToProps, actions)(Chatbox);