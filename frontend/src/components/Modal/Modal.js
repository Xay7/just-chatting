import React from 'react';
import styles from './Modal.module.scss';

const Modal = (props) => {
    return (
        <div
            className={styles.Modal}
            onClick={props.onclick}
            style={{
                zIndex: props.zIndex
            }}
        ></div>
    )
}

export default Modal;