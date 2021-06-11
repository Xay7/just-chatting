import React from 'react';
import styles from './Button.module.scss';

const Button = props => (
    <button
        className={styles[props.ClassName]}
        onClick={props.OnClick}>{props.children}</button>
)

export default Button
