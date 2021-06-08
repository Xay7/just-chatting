import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUsers } from '../../store/actions/index';
import styles from './Users.module.scss';
import socket from 'SocketClient';

const UsersList = () => {
  const { channels, roomID, members, loading } = useSelector((state) => ({
    channels: state.chat.channels,
    roomID: state.chat.roomID,
    members: state.chat.members,
    loading: state.chat.loading,
  }));
  const [users, setUsers] = useState(members);
  const [online, setOnline] = useState([]);

  const userLoggedInHandler = (user) => {
    console.log(user);
    const updatedUsers = users.map((el) => {
      if (el.id === user.id) {
        return {
          ...el,
          status: 'online',
        };
      } else return el;
    });
    setUsers(updatedUsers);
  };

  const userLogoutOutHandler = (user) => {
    const updatedUsers = users.map((el) => {
      if (el.id === user) {
        return {
          ...el,
          status: 'offline',
        };
      } else return el;
    });
    setUsers(updatedUsers);
  };

  const userChangedRoomHandler = (onlineUsers) => {
    const updatedUsers = users.map((user) => {
      onlineUsers.forEach((online) => {
        if (user.id === online.id) {
          user.status = 'online';
        }
      });
      return user;
    });
    setOnline(onlineUsers);
  };

  useEffect(() => {
    const updatedUsers = members.map((user) => {
      online.forEach((online) => {
        if (user.id === online.id) {
          user.status = 'online';
        }
      });
      return user;
    });
    setUsers(updatedUsers);
  }, [JSON.stringify(members), JSON.stringify(online)]);

  useEffect(() => {
    socket.on('USER_LOGGED_IN', (user) => {
      userLoggedInHandler(user);
    });

    socket.on('USER_JOINED_ROOM', (user) => {});

    socket.on('USER_CHANGED_ROOM', (users) => {
      userChangedRoomHandler(users);
    });

    socket.on('USER_LOGOUT', (user) => {
      userLogoutOutHandler(user);
    });
    return () => {
      socket.off('lol');
    };
  }, []);

  let usersRender = users.map((user) => {
    if (user.status === 'offline') {
      return (
        <div className={styles.UserWrapperOffline} key={user.name}>
          <img src={user.avatar} alt={user.avatar + ' avatar'} className={styles.AvatarOffline} />
          <div>{user.name}</div>
        </div>
      );
    } else
      return (
        <div className={styles.UserWrapper} key={user.name}>
          <div className={styles.Status}>
            <img src={user.avatar} alt={user.name + ' avatar'} className={styles.Avatar} />
          </div>
          <p className={styles.User} key={user.name}>
            {user.name}
          </p>
        </div>
      );
  });

  return (
    <React.Fragment>
      {!roomID || channels.length === 0 ? null : (
        <div className={styles.Users}>
          <h5 className={styles.UserRole}>Users</h5>
          {usersRender}
          {loading}
        </div>
      )}
    </React.Fragment>
  );
};

export default UsersList;
