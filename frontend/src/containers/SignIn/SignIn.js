import React, { Component } from 'react';
import styles from './SignIn.module.scss';
import Input from '../../components/Input/Input';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import { Link } from 'react-router-dom';

class SignIn extends Component {

    state = {
        email: null,
        password: null
    }

    onSubmit = async (e) => {
        e.preventDefault();
        this.props.signIn(this.state);
    }

    componentDidUpdate() {
        if (this.props.isAuth) {
            this.props.history.push('/chat')
        }
    }

    onChangeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }


    render() {

        let inputStyle = this.props.error ? styles.InputError : styles.Input;


        let errorMessage = null;

        if (this.props.error) {
            errorMessage = <div className={styles.ErrorMessage}>
                <p className={styles.ErrorParagraph}>Wrong email or password</p>
            </div>
        }

        return (
            <div className={styles.Body}>
                <div className={styles.Form}>
                    <h1 className={styles.Login}>Login</h1>
                    <form onSubmit={this.onSubmit} >
                        <Input inputClass={inputStyle} inputPlaceholder="Email" inputType="email" onchange={this.onChangeHandler} inputName="email" {...this.props}>Email</Input>
                        <Input inputClass={inputStyle} inputPlaceholder="Password" inputType="password" onchange={this.onChangeHandler} inputName="password" {...this.props}>Password</Input>
                        {errorMessage}
                        <button type="submit" onClick={this.onSubmit} className={styles.SubmitBtn}>SUBMIT</button>

                    </form>
                </div>
                <Link to='/signup' className={styles.Link}>Click here to register</Link>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuthenticated,
        error: state.auth.signInError
    }
}

export default connect(mapStateToProps, actions)(SignIn);