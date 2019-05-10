import React from 'react';
import styles from './Input.module.scss';
import { connect } from 'react-redux';

const Input = (props) => {
    return (
        <div className={styles.InputContainer}>
            {/* <label htmlFor={props.inputType} className={styles.Label}>{props.children}</label> */}
            <input placeholder={props.inputPlaceholder} className={props.inputClass} type={props.inputType} name={props.inputName} onChange={props.onchange} autoComplete="true"></input>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        error: state.auth.errorMessage
    }
}

export default connect(mapStateToProps)(Input);