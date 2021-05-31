import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './Users.module.scss';
import socket from 'SocketClient';

const UsersList = () => {
  const { channels, roomID } = useSelector((state) => ({
    channels: state.chat.channels,
    roomID: state.chat.roomID,
  }));

  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const usersRef = useRef(users);

  const roomUserListHandler = (users) => {
    if (users == null) {
      return;
    }
    setUsers(users);
  };

  const userLoggedInHandler = (data) => {
    const userExists = data.some((el) => {
      return el.username === data.username;
    });

    if (userExists) {
      return;
    }
    setUsers(...users, data);
  };

  useEffect(() => {
    socket.on('ROOM_USER_LIST', (users) => {
      roomUserListHandler(users, usersRef.current, setUsers);
    });

    socket.on('USER_LOGGED_IN', (users) => {
      userLoggedInHandler(users, usersRef.current, setUsers);
    });

    socket.on('USER_JOINED_ROOM', (data) => {
      setUsers(...users, data);
      setMembers(...members, data);
    });

    socket.on('USER_LEFT_ROOM', (id) => {
      const updatedUsers = users.filter((el) => {
        return el.id !== id;
      });
      const updatedMembers = members.filter((el) => {
        return el.id !== id;
      });
      setUsers(updatedUsers);
      setMembers(updatedMembers);
    });

    socket.on('USER_DISCONNECTED', (id) => {
      const updatedUsers = users.filter((el) => {
        return el.id !== id;
      });
      setUsers(updatedUsers);
    });
    return () => {
      socket.off('lol');
    };
  }, []);

  useEffect(() => {
    usersRef.current = users;
  });

  // componentDidUpdate(prevProps, prevState) {
  //   if (JSON.stringify(prevProps.members) !== JSON.stringify(this.props.members)) {
  //     this.setState({ members: this.props.members });
  //   }
  // }

  let connectedUsers = users.map((user) => {
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

  let memberss = null;

  // Filter those who are online and not
  memberss = members.map((data) => {
    const isOnline = users.some((el) => {
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

  // Filter those who are online and not

  return (
    <React.Fragment>
      {!roomID || channels.length === 0 ? null : (
        <div className={styles.Users}>
          <h5 className={styles.UserRole}>Online</h5>
          {connectedUsers}
          {members.length > 1 && <h5 className={styles.UserRole}>Offline</h5>}
          {memberss}
        </div>
      )}
    </React.Fragment>
  );
};

export default UsersList;
