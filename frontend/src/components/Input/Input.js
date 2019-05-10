import React from 'react';
import styles from './Input.module.scss';

const Input = (props) => {
    return (
        <div className={styles.InputContainer}>
            <label htmlFor={props.inputType}>{props.children}</label>
            <input className={styles.Input} type={props.inputType} name={props.inputName} onChange={props.onchange} autoComplete="true"></input>
        </div>
    )
}

export default Input;