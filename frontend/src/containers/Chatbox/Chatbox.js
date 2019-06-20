import React, { Component } from 'react';
import styles from './Chatbox.module.scss';
import { connect } from 'react-redux';
import moment from 'moment';
import { getChatMessages, storeMessage, isFetching } from '../../store/actions/index';
import UserTyping from '../../components/UserTyping/UserTyping';
import Loader from '../../components/Loader/Loader';

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
                author: {
                    name: this.props.username,
                    avatar: this.props.avatar
                },
                body: this.state.message,
                created_at: moment(),
                avatar: this.props.avatar,
                room: this.props.channelID
            }

            this.socket.emit('SEND_MESSAGE', socketMessage)

            let dbData = {
                body: this.state.message,
                id: this.props.channelID,
                created_at: moment(),
            }

            await this.props.storeMessage(dbData);

        }

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        this.socket.on('UPDATING_MESSAGES', (data) => {
            this.setState({
                room: data.room,
                messages: this.props.messages,
                message: ''
            });
            this.scrollToBottom()
        });

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
        if (this.messageContainer === undefined || this.messageContainer === null) return;
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

            this.props.isFetching();

            const previosScrollHeight = this.messageContainer.scrollHeight;

            let data = {
                channel_id: this.props.channelID,
                skipMessages: this.props.skip
            }

            await this.props.getChatMessages(data)

            let messages = [...this.props.messages, ...this.state.messages];

            this.setState({ messages: messages })

            this.messageContainer.scrollTop = this.messageContainer.scrollHeight - previosScrollHeight



        }
    }


    render() {

        let messages = this.state.messages.map((data, index, arr) => {
            // CHECK IF IMAGE IS URL AND IMAGE
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
                // CHECK FOR SAME AUTHOR AND IF THERE IS LESS THAN 30 MINUTES TIME DIFFERENCE BETWEEN LAST MESSAGE
                if (data.author.name === arr[index - 1].author.name && moment(data.created_at).diff(moment(arr[index - 1].created_at), "minutes") < 30) {
                    return (
                        <div className={styles.Messages} key={index}>
                            <div className={styles.Message}>{data.body}</div>
                        </div>
                    )
                }
                // RENDER MESSAGE WITH USER HEADER
                else {
                    return (
                        <div className={styles.Messages} key={index}>
                            <hr className={styles.MessageHorizontalLine}></hr>
                            <div className={styles.MessageHeader}>
                                <img src={data.author.avatar} alt={data.author.name + " avatar"} className={styles.Avatar} />
                                <p className={styles.Username}>{data.author.name}</p>
                                <p className={styles.Date}>{moment(data.created_at).calendar(null)}</p>
                            </div>
                            <div className={styles.Message}>{data.body}</div>
                        </div>
                    )
                };
            }
            // FIRST RENDER
            else {
                return (
                    <div className={styles.Messages} key={index}>
                        <hr className={styles.MessageHorizontalLine}></hr>
                        <div className={styles.MessageHeader}>
                            <img src={data.author.avatar} alt={data.author.name + " avatar"} className={styles.Avatar} />
                            <p className={styles.Username}>{data.author.name}</p>
                            <p className={styles.Date}>{moment(data.created_at).calendar(null)}</p>
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
                        {this.props.loading && <Loader />}
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
        user_id: state.auth.user_id,
        users: state.auth.users,
        socketChat: state.auth.socket,
        roomID: state.chat.roomID,
        messages: state.chat.messages,
        channelID: state.chat.channelID,
        avatar: state.auth.avatar,
        channels: state.chat.channels,
        skip: state.chat.skip,
        noMessages: state.chat.noMessages,
        loading: state.chat.loading
    }
}

const mapDispatchToProps = {
    getChatMessages,
    storeMessage,
    isFetching
}


export default connect(mapStateToProps, mapDispatchToProps)(Chatbox);