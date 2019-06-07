import React from 'react';
import styles from './ErrorMessage.module.scss';

const ErrorMessage = (props) => {
    return (
        <div className={styles.ErrorMessageWrapper}>
            <h4 className={styles.ErrorMessageTxt}>{props.children}</h4>
        </div>
    )
}


export default ErrorMessage;
