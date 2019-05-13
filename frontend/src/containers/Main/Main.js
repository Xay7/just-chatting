import React, { Component } from 'react';
import styles from './Main.module.scss';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';

class Main extends Component {



    tokenAccess = async () => {
        await this.props.tokenAccess();
        if (this.props.tokenAuthSuccess) {
            await this.props.history.push('/chat');
        }
        else {
            await this.props.history.push('/signin');
        }

    }



    render() {

        return (
            <div className={styles.Body}>
                <div>
                    <h1 className={styles.Title}>Just chatting</h1>
                </div>
                <button className={styles.Login} onClick={this.tokenAccess}>Login</button>
                <Link to="/signup">
                    <button className={styles.Register}>Register</button>
                </Link>

            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        tokenAuthSuccess: state.auth.tokenSuccess
    }
}

export default connect(mapStateToProps, actions)(Main);