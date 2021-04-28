import React, { Component } from 'react';
import styles from './Users.module.scss';
import { connect } from 'react-redux';

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      members: [],
    };

    this.socket = this.props.socketChat;

    this.socket.on('ROOM_USER_LIST', (data) => {
      this.setState({ users: data });
    });

    this.socket.on('USER_LOGGED_IN', (data) => {
      const userExists = this.state.users.some((el) => {
        return el.username === data.username;
      });

      if (userExists) {
        return;
      }

      this.setState({ users: [...this.state.users, data] });
    });

    this.socket.on('USER_JOINED_ROOM', (data) => {
      const updatedUsers = [...this.state.users, data];
      const updatedMembers = [...this.state.members, data];
      this.setState({ users: updatedUsers, members: updatedMembers });
    });

    this.socket.on('USER_LEFT_ROOM', (id) => {
      const updatedUsers = this.state.users.filter((el) => {
        return el.id !== id;
      });
      const updatedMembers = this.state.members.filter((el) => {
        return el.id !== id;
      });
      this.setState({ users: updatedUsers, members: updatedMembers });
    });

    this.socket.on('USER_DISCONNECTED', (id) => {
      const updatedUsers = this.state.users.filter((el) => {
        return el.id !== id;
      });
      this.setState({ users: updatedUsers });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.members) !== JSON.stringify(this.props.members)) {
      this.setState({ members: this.props.members });
    }
  }

  render() {
    let connectedUsers = this.state.users.map((user) => {
      return (
        <div className={styles.UserWrapper} key={user.username}>
          <div className={styles.Status}>
            <img src={user.avatar} alt={user.username + ' avatar'} className={styles.Avatar} />
          </div>
          <p className={styles.User} key={user.username}>
            {user.username}
          </p>
        </div>
      );
    });

    let members = null;

    // Filter those who are online and not
    members = this.state.members.map((data) => {
      const isOnline = this.state.users.some((el) => {
        return el.id === data.id;
      });
      if (isOnline) {
        return null;
      } else
        return (
          <div className={styles.UserWrapperOffline} key={data.name}>
            <img src={data.avatar} alt={data.avatar + ' avatar'} className={styles.AvatarOffline} />
            <div>{data.name}</div>
          </div>
        );
    });

    return (
      <React.Fragment>
        {!this.props.roomID || this.props.channels.length === 0 ? null : (
          <div className={styles.Users}>
            <h5 className={styles.UserRole}>Online</h5>
            {connectedUsers}
            {this.state.members.length > 1 && <h5 className={styles.UserRole}>Offline</h5>}
            {members}
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    socketChat: state.auth.socket,
    members: state.chat.members,
    roomOwner: state.chat.roomOwner,
    channel: state.chat.channelID,
    loading: state.chat.loading,
    roomID: state.chat.roomID,
    channels: state.chat.channels,
  };
};

export default connect(mapStateToProps)(Users);
