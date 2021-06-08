import React from 'react';
import Modal from 'components/Modal/Modal';
import Options from 'components/Options/Options';
import styles from './Rooms.module.scss';

const AddOrJoin = (props) => {
  return (
    <div>
      <Modal onClick={props.showAddOrJoin} />
      <Options>
        <div className={styles.Wrapper}>
          <div className={styles.JoinAndAdd}>
            <h3>Create new room</h3>
            <p className={styles.Description}>Make a new room and invite whoever you want to</p>
            <button onClick={props.showAdd} className={styles.Btn}>
              Create
            </button>
          </div>
          <div className={styles.JoinAndAdd}>
            <h3>Join existing room</h3>
            <p className={styles.Description}>Grab room ID and simply enter it to join friends room</p>
            <button onClick={props.showJoin} className={styles.Btn}>
              Join
            </button>
          </div>
        </div>
      </Options>
    </div>
  );
};

export default AddOrJoin;
