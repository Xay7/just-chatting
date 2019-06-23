import React, { Component } from 'react';
import styles from './SignUp.module.scss';
import Input from '../../components/Input/Input';
import { connect } from 'react-redux';
import { signUp } from '../../store/actions/index';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import FetchResponse from '../../components/FetchResponse/FetchResponse';
import { clearFetchMessage } from '../../store/actions/index';
import Footer from '../../components/Footer/Footer';

class SignUp extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        loading: false,
        submitError: false
    }

    onSubmit = async () => {

        this.setState({ loading: true });

        const userInfo = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
        }

        await this.props.signUp(userInfo);

        this.setState({ loading: false });

        if (this.props.registered) {
            this.props.history.push('/signin');
        }
        else {
            this.setState({ submitError: true })
        }
    }

    onChangeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }


    render() {

        let inputStyle = this.props.errorMessage ? styles.InputError : styles.Input;

        let errorMessage = <div className={styles.Information}>
            <p className={styles.ErrorParagraph}>Name must be longer than 3 characters</p>
            <p className={styles.ErrorParagraph}>Password must be longer than 6 characters</p>
        </div>;


        if (this.props.error) {
            errorMessage = <div className={styles.ErrorMessage}>
                <FetchResponse>{this.props.errorMessage}</FetchResponse>
                <p className={styles.ErrorParagraph}>Name must be longer than 3 characters</p>
                <p className={styles.ErrorParagraph}>Password must be longer than 6 characters</p>
            </div>
        }

        let submitButton = <button type="submit" onClick={this.onSubmit} className={styles.SubmitBtn}>SUBMIT</button>

        if (this.state.loading) {
            submitButton = <Spinner />
        }

        return (

            <div className={styles.Body}>
                <div className={styles.Form}>
                    <h1 className={styles.Login}>Register</h1>
                    <form onSubmit={this.onSubmit}>
                        <Input inputClass={inputStyle} inputPlaceholder="Name" inputType="text" onchange={this.onChangeHandler} inputName="name">Username</Input>
                        <Input inputClass={inputStyle} inputPlaceholder="Email" inputType="email" onchange={this.onChangeHandler} inputName="email">Email</Input>
                        <Input inputClass={inputStyle} inputPlaceholder="Password" inputType="password" onchange={this.onChangeHandler} inputName="password">Password</Input>
                        {errorMessage}
                    </form>
                    {submitButton}
                </div>
                <Link to='/signin' className={styles.Link} onClick={this.props.clearFetchMessage}>If you have an account sign in here</Link>
                <Footer />
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuthenticated,
        error: state.auth.signUpError,
        errorMessage: state.auth.errorMessage,
        registered: state.auth.registerSuccess
    }
}

const mapDispatchToProps = {
    signUp,
    clearFetchMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);