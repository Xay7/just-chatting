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

    onSubmit = async () => {
        this.props.signIn(this.state)
    }

    onChangeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <div className={styles.Body}>
                <div className={styles.Form}>
                    <h1 className={styles.Login}>Login</h1>
                    <form onSubmit={this.onSubmit}>
                        <Input inputType="email" onchange={this.onChangeHandler} inputName="email">Email</Input>
                        <Input inputType="password" onchange={this.onChangeHandler} inputName="password">Password</Input>
                    </form>
                    <button type="submit" onClick={this.onSubmit} className={styles.SubmitBtn}>SUBMIT</button>
                </div>
                <Link to='/signup'>Click here to register</Link>
            </div >
        )
    }
}

export default connect(null, actions)(SignIn);