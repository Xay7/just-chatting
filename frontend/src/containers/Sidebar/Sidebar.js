import React, { Component } from 'react';
import styles from './Sidebar.module.scss';
import { connect } from 'react-redux';
import axios from 'axios';

class Sidebar extends Component {

    state = {
        chatRooms: [null]
    }

    async componentDidMount() {
        await this.setState({ chatRooms: this.props.chatRooms });
    }

    addNewRoom = async () => {
        const name = await prompt();

        let data = {
            name: name,
            owner: this.props.name

        }

        await axios.post('http://localhost:3001/users/newchat', data);

        const token = localStorage.getItem('JWT_TOKEN');

        const res = await axios.get('http://localhost:3001/users/chat', {
            headers: {
                'authorization': token
            }
        })

        this.setState({ chatRooms: res.data.chatRooms });

        console.log(res);
    }



    render() {



        let rooms = this.state.chatRooms.map(el => {
            return <div style={{ color: 'white' }}>{el}</div>
        })

        return (
            <div className={styles.Sidebar}>
                <button onClick={this.addNewRoom}>ADD NEW ROOM</button>
                {rooms}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        chatRooms: state.auth.chatRooms,
        name: state.auth.name
    }

}

export default connect(mapStateToProps)(Sidebar);