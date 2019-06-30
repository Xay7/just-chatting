import React, { Component, Fragment } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Chatbox from '../Chatbox/Chatbox';
import Users from '../Users/Users';
import styles from './Chat.module.scss';
import RoomHelpers from '../RoomHelpers/RoomHelpers';
import Rooms from '../Rooms/Rooms';
import { connect } from 'react-redux';
import { Logout } from '../../store/actions/index';

class Chat extends Component {

    onUnload = (e) => { // the method that will be used for both add and remove event
        this.props.Logout();
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.onUnload)
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', function (event) {
            window.history.pushState(null, document.title, window.location.href);
        });
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload)
    }
    render() {
        return (
            <Fragment>
                <div className={styles.Holder}>
                    <Rooms />
                    <div>
                        <RoomHelpers />
                        <div className={styles.Chat}>
                            <Sidebar />
                            <Chatbox />
                            <Users />
                        </div>
                    </div>



                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = {
    Logout
}



export default connect(null, mapDispatchToProps)(Chat);