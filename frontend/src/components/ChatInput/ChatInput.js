import React from 'react';
import styles from './ChatInput.module.scss';

const ChatInput = (props) => (
    <div className={styles.InputWrapper}>
        <label htmlFor={props.ID} className={styles.InputLabel}>{props.children}</label>
        <input
            type={props.Type}
            onChange={props.OnChange}
            className={styles[props.ClassName]}
            placeholder={props.Placeholder}
            id={props.ID}
            autoComplete={props.AutoComplete}
        />
        <div>
        </div>
    </div>
)

export default ChatInput;