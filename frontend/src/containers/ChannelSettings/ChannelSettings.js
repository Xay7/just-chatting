import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeChannelData, deleteChannel } from '../../store/actions/index';
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

    changeData = async () => {

        if (this.state.channelName === '' && this.state.channelDescription === '') {
            return console.log("No changes provided")
        }

        let data = {
            channelName: this.state.channelName,
            channelDescription: this.state.channelDescription,
            id: this.props.channelID,
            oldChannelName: this.props.channelName.substring(1),
        }

        console.log(this.props);

        await this.props.changeChannelData(data);
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

    deleteChannel = async id => {
        await this.props.deleteChannel(id);
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
                        confirm={() => this.deleteChannel(this.props.channelID)}
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
                            AutoComplete="off"
                            ClassName={this.props.errorMessage ? "InputError" : "Input"}
                        >Room Name</ChatInput>
                        <ChatInput
                            Type="text"
                            OnChange={this.channelDescriptionHandler}
                            Placeholder="New description"
                            ID="channelDescription"
                            AutoComplete="off"
                            ClassName={this.props.errorMessage ? "InputError" : "Input"}
                        >Room description</ChatInput>
                        {this.props.errorMessage && <ErrorMessage>{this.props.errorMessage}</ErrorMessage>}
                        {this.props.successMessage && <ErrorMessage>{this.props.successMessage}</ErrorMessage>}
                        <div className={styles.Btns}>
                            <Button ClassName="Cancel" OnClick={this.props.display}>Cancel</Button>
                            <Button ClassName="Confirm" OnClick={this.changeData}>Submit</Button>
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

const mapDispatchToProps = {
    changeChannelData,
    deleteChannel
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSettings);
