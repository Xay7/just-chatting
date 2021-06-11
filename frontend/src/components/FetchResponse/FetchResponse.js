import React from 'react';
import styles from './FetchResponse.module.scss';

const FetchMessage = (props) => {
    return (
        <div className={styles.ErrorMessageWrapper}>
            <h4 className={styles.ErrorMessageTxt}>{props.children}</h4>
        </div>
    )
}


export default FetchMessage;
