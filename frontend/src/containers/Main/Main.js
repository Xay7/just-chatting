import React, { Component } from 'react';
import styles from './Main.module.scss';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import Footer from '../../components/Footer/Footer';

class Main extends Component {

    // tokenAccess = async () => {
    //     await this.props.tokenAccess();
    //     if (this.props.tokenAuthSuccess) {
    //         await this.props.history.push('/chat');
    //     }
    //     else {
    //         await this.props.history.push('/signin');
    //     }

    // }



    render() {

        return (
            <React.Fragment>
                <div className={styles.Body}>
                    <div>
                        <h1 className={styles.Title}>Just chatting</h1>
                    </div>
                    <div className={styles.DescriptionWrapper}>
                        <p className={styles.Description}>Real time text chat with personal rooms and channels. Join today and chat for free!</p>
                    </div>
                    <Link to="/signin">
                        <button className={styles.Login} onClick={this.tokenAccess}>Login</button>
                    </Link>
                    <Link to="/signup">
                        <button className={styles.Register}>Register</button>
                    </Link>
                    <Footer />
                </div>

            </React.Fragment>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        tokenAuthSuccess: state.auth.tokenSuccess
    }
}

export default connect(mapStateToProps, actions)(Main);