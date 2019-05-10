import React, { Component } from 'react';
import styles from './SignUp.module.scss';
import Input from '../../components/Input/Input';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import { Link } from 'react-router-dom';

class SignUp extends Component {

    state = {
        name: null,
        email: null,
        password: null,
    }

    onSubmit = async () => {
        this.props.signUp(this.state);
    }

    onChangeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {

        let inputStyle = this.props.error ? styles.InputError : styles.Input;




        let errorMessage = <div className={styles.Information}>
            <p >Name must be longer than 3 characters</p>
            <p>Password must be longer than 6 characters</p>
        </div>;


        if (this.props.error) {
            errorMessage = <div className={styles.ErrorMessage}>
                <p className={styles.ErrorParagraph}>Name must be longer than 3 characters</p>
                <p className={styles.ErrorParagraph}>Password must be longer than 6 characters</p>
                <p className={styles.ErrorParagraph}>Email may be in use</p>
            </div>
        }



        return (
            <div className={styles.Body}>
                <div className={styles.Form}>
                    <h1 className={styles.Login}>Register</h1>
                    <form onSubmit={this.onSubmit}>
                        <Input inputClass={inputStyle} inputPlaceholder="Name" inputType="text" onchange={this.onChangeHandler} inputName="name">Name</Input>
                        <Input inputClass={inputStyle} inputPlaceholder="Email" inputType="email" onchange={this.onChangeHandler} inputName="email">Email</Input>
                        <Input inputClass={inputStyle} inputPlaceholder="Password" inputType="password" onchange={this.onChangeHandler} inputName="password">Password</Input>
                        {errorMessage}
                    </form>
                    <button type="submit" onClick={this.onSubmit} className={styles.SubmitBtn}>SUBMIT</button>
                </div>
                <Link to='/signin' className={styles.Link}>If you have an account sign in here</Link>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuthenticated,
        error: state.auth.signUpError
    }
}

export default connect(mapStateToProps, actions)(SignUp);