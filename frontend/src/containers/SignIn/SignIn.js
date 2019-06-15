import React, { Component } from 'react';
import styles from './SignIn.module.scss';
import Input from '../../components/Input/Input';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';


class SignIn extends Component {

    state = {
        email: null,
        password: null,
        loading: false
    }

    onSubmit = async (e) => {
        this.setState({ loading: true });

        e.preventDefault();
        const userInfo = {
            email: this.state.email,
            password: this.state.password
        }

        await this.props.signIn(userInfo);

        this.setState({ loading: false });

        if (this.props.isAuth) {
            this.props.history.push('/chat')
        }
    }

    onChangeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }


    render() {

        let inputStyle = this.props.errorMessage ? styles.InputError : styles.Input;


        let errorMessage = null;

        if (this.props.errorMessage) {
            errorMessage = <ErrorMessage>{this.props.errorMessage}</ErrorMessage>
        }

        let registerSuccess = null;

        if (this.props.registered) {
            registerSuccess = <p className={styles.RegisterSuccess}>Registration succesful, you can login</p>
        }


        let submitButton = <button type="submit" onClick={this.onSubmit} className={styles.SubmitBtn}>SUBMIT</button>

        if (this.state.loading) {
            submitButton = <Spinner />
        }

        return (
            <div className={styles.Body}>
                <div className={styles.Form}>
                    <h1 className={styles.Login}>Login</h1>
                    <form onSubmit={this.onSubmit} >
                        <Input inputClass={inputStyle} inputPlaceholder="Email" inputType="email" onchange={this.onChangeHandler} inputName="email" {...this.props}>Email</Input>
                        <Input inputClass={inputStyle} inputPlaceholder="Password" inputType="password" onchange={this.onChangeHandler} inputName="password" {...this.props}>Password</Input>
                        {errorMessage}
                        {registerSuccess}
                        {submitButton}
                    </form>
                </div>
                <Link to='/signup' className={styles.Link} onClick={this.props.clearFetchMessage}>Click here to register</Link>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuthenticated,
        errorMessage: state.auth.errorMessage,
        registered: state.auth.registerSuccess
    }
}

export default connect(mapStateToProps, actions)(SignIn);