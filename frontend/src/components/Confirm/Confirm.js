import React from 'react';
import styles from './Confirm.module.scss';

const Options = (props) => {
    return (
        <div className={styles.DeleteRoomWrapper}>
            <div className={styles.Text}>
                <h3>{props.header}</h3>
                <p>{props.description}</p>

            </div>
            <div className={styles.Btns}>
                <button onClick={props.cancel} className={styles.Cancel}>Cancel</button>
                <button onClick={props.confirm} className={styles.Confirm}>Confirm</button>
            </div>
        </div>
    )
}

export default Options;