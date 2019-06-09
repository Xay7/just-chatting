import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../store/actions/chatroom';
import styles from './ChannelSettings.module.scss';
import Modal from '../../components/Modal/Modal';
import Options from '../../components/Options/Options';
import ChatInput from '../../components/ChatInput/ChatInput';
import Button from '../../components/Button/Button';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Confirm from '../../components/Confirm/Confirm';

class ChannelSettings extends Component {

    state = {
        showConfirmDelete: false,
        channelName: '',
        channelDescription: ''
    }

    changeChannelSettings = async () => {
        let data = {
            channelName: this.state.channelName,
            channelDescription: this.state.channelDescription,
            channel: this.props.channelID,
            oldChannelName: this.props.channelName.substring(1),
            username: this.props.username,
            room: this.props.roomID
        }

        await this.props.changeChannelSettings(data);
    }

    showConfirmDelete = () => {
        this.setState({ showConfirmDelete: !this.state.showConfirmDelete });
    }

    channelNameHandler = (e) => {
        this.setState({ channelName: e.target.value })
    }

    channelDescriptionHandler = (e) => {
        this.setState({ channelDescription: e.target.value })
    }

    deleteChannel = async (roomID, channelID, username) => {
        await this.props.deleteChannel(roomID, channelID, username);
        this.setState({
            showConfirmDelete: false,
        })
        this.props.display();
    }


    render() {
        return (
            <React.Fragment>
                {this.state.showConfirmDelete && <React.Fragment>
                    <Modal onclick={this.showConfirmDelete} zIndex="2000" />
                    <Confirm
                        cancel={this.showConfirmDelete}
                        confirm={() => this.deleteChannel(this.props.roomID, this.props.channelID, this.props.username)}
                        header={`Delete ${this.props.channelName}`}
                        description={`Are you sure you want to delete ${this.props.channelName}?`}
                    />
                </React.Fragment>}
                <Modal onclick={this.props.display} />
                <Options>
                    <div className={styles.ChannelSettingsWrapper}>
                        <h3>Edit channel settings</h3>
                        <ChatInput
                            Type="text"
                            OnChange={this.channelNameHandler}
                            Placeholder="New channel name"
                            ID="channelName"
                            autoComplete="off"
                            ClassName={this.props.errorMessage ? "InputError" : "Input"}
                        >Room Name</ChatInput>
                        <ChatInput
                            Type="text"
                            OnChange={this.channelDescriptionHandler}
                            Placeholder="New description"
                            ID="channelDescription"
                            autoComplete="off"
                            ClassName={this.props.errorMessage ? "InputError" : "Input"}
                        >Room description</ChatInput>
                        {this.props.errorMessage && <ErrorMessage>{this.props.errorMessage}</ErrorMessage>}
                        {this.props.successMessage && <ErrorMessage>{this.props.successMessage}</ErrorMessage>}
                        <div className={styles.Btns}>
                            <Button ClassName="Cancel" OnClick={this.props.display}>Cancel</Button>
                            <Button ClassName="Confirm" OnClick={this.changeChannelSettings}>Submit</Button>
                        </div>
                        <Button ClassName="Danger" OnClick={this.showConfirmDelete}>Delete Channel</Button>
                    </div>
                </Options>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        channelName: state.chat.channelName,
        channelID: state.chat.channelID,
        username: state.auth.username,
        roomID: state.chat.roomID,
    }
}

export default connect(mapStateToProps, actions)(ChannelSettings);
