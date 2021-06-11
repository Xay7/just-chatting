import React from 'react';
import styles from './Modal.module.scss';
import usePortal from 'helpers/usePortal';

const Modal = (props) => {
  const portal = usePortal();
  return portal(
    <div
      className={styles.Modal}
      onClick={props.onClick}
      style={{
        zIndex: props.zIndex,
      }}></div>
  );
};

export default Modal;
