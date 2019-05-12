import React, { Component } from 'react';
import styles from './Main.module.scss';
import { Link } from 'react-router-dom';

class Main extends Component {

    // TODO
    // ADD NAVBAR

    componentDidUpdate() {
        if (this.props.isAuth) {
            this.props.history.push('/chat')
        }
    }
    render() {
        return (
            <div className={styles.Body}>
                <div>
                    <h1 className={styles.Title}>Just chatting</h1>
                </div>
                <Link to="/signin">
                    <button className={styles.Login}>Login</button>
                </Link>
                <Link to="/signup">
                    <button className={styles.Register}>Register</button>
                </Link>

            </div>
        )
    }

}

export default Main;