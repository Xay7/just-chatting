import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Rooms.module.scss';
import { updateRooms, changeRoom, clearFetchMessage, Logout } from '../../store/actions/index';
import { withRouter, useHistory } from 'react-router-dom';
import Tooltip from '../../components/Tooltip/Tooltip';
import AddRoom from './AddRoom';
import JoinRoom from './JoinRoom';
import AddOrJoin from './AddOrJoin';

const Rooms = (props) => {
  const { roomID, user_id, chatRooms } = useSelector((state) => ({
    username: state.auth.username,
    roomID: state.chat.roomID,
    avatar: state.auth.avatar,
    user_id: state.auth.user_id,
    chatRooms: state.chat.chatRooms,
  }));
  const dispatch = useDispatch();
  const history = useHistory();
  const [showAddOrJoin, setShowAddOrJoin] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');

  const changeChatroom = async (id) => {
    const previousRoom = roomID;
    setSelectedRoom(id);
    await dispatch(changeRoom(id, previousRoom));
    props.inRoom();
  };

  const showAddorJoinHandler = () => {
    setShowAddOrJoin(!showAddOrJoin);
    setShowAdd(false);
    setShowJoin(false);
  };

  const showJoinHandler = () => {
    dispatch(clearFetchMessage());
    setShowJoin(!showJoin);
    setShowAddOrJoin(false);
    setShowAdd(false);
  };

  const showAddHandler = () => {
    dispatch(clearFetchMessage());
    setShowAdd(!showAdd);
    setShowAddOrJoin(false);
    setShowJoin(false);
  };
  useEffect(() => {
    dispatch(updateRooms(user_id));
  }, [user_id, dispatch]);

  // Changes selected room styles for visual clarity
  const currentRoomStyle = (id) => {
    const isSelected = selectedRoom === id;
    // True is room selected, rest are not
    return isSelected ? styles.RoomSelected : styles.RoomNotSelected;
  };
  // Disables click on currect room to prevent multiple socket calls
  const currentRoomDisable = (id) => {
    const isSelected = selectedRoom === id;
    return isSelected ? true : false;
  };

  const logout = () => {
    dispatch(Logout());
    history.push('/');
  };

  let chatRoomsStructure = chatRooms.map((room) => {
    return (
      <div key={room.id}>
        <button className={currentRoomStyle(room.id)} onClick={() => changeChatroom(room.id)} disabled={currentRoomDisable(room.id)}>
          {room.name.charAt(0)}
        </button>
      </div>
    );
  });

  let noRooms = !roomID;

  if (!roomID) {
    noRooms = (
      <div className={styles.NoRooms}>
        <div className={styles.NoRoomsTextWrapper}>
          <h1>Waiting to join a room</h1>
          <p>You can add or join a room by pressing plus button</p>
        </div>
      </div>
    );
  } else noRooms = null;

  return (
    <React.Fragment>
      {noRooms}
      <div className={styles.Rooms}>
        {chatRoomsStructure}
        <Tooltip where="Right" distance="-90px" text="Create & Join" height="50px" width="50px" margin="0 0 0px 0" position="relative">
          <button onClick={showAddorJoinHandler} className={styles.AddChatroom}>
            +
          </button>
        </Tooltip>

        <Tooltip where="Right" distance="-40px" text="Logout" wrapper="Bottom" height="50px" width="50px" margin="0 0 0px 0" position="relative">
          <i
            className="fas fa-sign-out-alt fa-lg"
            style={{
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={logout}></i>
        </Tooltip>
      </div>
      {showAddOrJoin ? <AddOrJoin showAdd={showAddHandler} showJoin={showJoinHandler} showAddOrJoin={showAddorJoinHandler} /> : null}
      {showJoin ? <JoinRoom showJoin={showJoinHandler} /> : null}
      {showAdd ? <AddRoom showAdd={showAddHandler} /> : null}
    </React.Fragment>
  );
};

export default withRouter(Rooms);
