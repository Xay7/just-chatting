import React, { Component } from 'react'
import { connect } from 'react-redux';
import styles from './UserSettings.module.scss';
import Modal from '../../components/Modal/Modal';
import Options from '../../components/Options/Options';
import Button from '../../components/Button/Button';
import ChatInput from '../../components/ChatInput/ChatInput';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { updateAvatar, updatePassword } from '../../store/actions/index';

export class UserSettings extends Component {

    state = {
        fileUploaded: false,
        password: '',
        confirmPassword: '',
        avatar: '',
        avatarPreview: '',
        avatarError: '',
        avatarSuccess: '',
    }

    uploadFile = (e) => {

        const avatar = e.target.files[0]

        if (avatar === undefined) {
            return;
        }

        if (avatar.type === "image/jpeg" || avatar.type === "image/jpg" || avatar.type === "image/png") {

            if (avatar.size > 1048576) {
                return this.setState({
                    avatarError: "File size must be less than 1MB",
                    avatarSuccess: ''
                })
            }

            let url = URL.createObjectURL(avatar);

            this.setState({
                avatar: avatar,
                fileUploaded: true,
                avatarPreview: url
            })
        } else {
            this.setState({
                avatarError: "File must me .jpg/.jpeg/.png",
                avatarSuccess: ''
            })
        }
    }

    submitAvatar = async (e) => {

        e.preventDefault();
        const formData = new FormData();

        if (this.state.avatar === ``) {
            return this.setState({
                avatarError: "No file provided",
                avatarSuccess: ''
            })
        }

        formData.append('avatar', this.state.avatar);

        await this.props.updateAvatar(formData, this.props.user_id);

        this.setState({
            avatarSuccess: "Your avatar has been updated",
            avatarError: ''
        });

    }

    submitPassword = (e) => {
        e.preventDefault();

        const data = {
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        }

        this.props.updatePassword(data, this.props.user_id);
    }

    changePassword = (e) => {
        this.setState({ password: e.target.value })
    }


    confirmPassword = (e) => {
        this.setState({ confirmPassword: e.target.value })
    }


    render() {
        return (
            <React.Fragment>
                <Modal onclick={this.props.toggleDisplay} />
                <Options>
                    <div className={styles.UserSettings}>
                        <div className={styles.ChangeUserSettings}>
                            <h3>Change your avatar</h3>
                            <label
                                htmlFor="upload"
                                style={{
                                    backgroundImage: `url(${this.state.fileUploaded ? this.state.avatarPreview : this.props.avatar})`,
                                    backgroundSize: 'cover',
                                    width: '128px',
                                    height: '128px',
                                    borderRadius: '50%',
                                    transition: '150ms all ease-in'
                                }}
                                className={styles.AvatarPreview}>
                                <input
                                    id="upload"
                                    type="file"
                                    onChange={this.uploadFile}
                                    accept="image/*"
                                    style={{
                                        display: 'none'
                                    }} />
                            </label>
                            {this.state.avatarError && <p style={{ color: "red", fontSize: "10px", margin: "0" }}>{this.state.avatarError}</p>}
                            {this.state.avatarSuccess && <p style={{ color: "green", fontSize: "10px", margin: "0" }}>{this.state.avatarSuccess}</p>}
                            <Button ClassName="Confirm" OnClick={this.submitAvatar}>Confirm</Button>
                        </div>
                        <div className={styles.ChangeUserSettings}>
                            <h3>Change password</h3>
                            <form onSubmit={this.submitPassword} style={{ width: '100%' }}>
                                <ChatInput
                                    Type="password"
                                    OnChange={this.changePassword}
                                    Placeholder="New password"
                                    ID="password"
                                    AutoComplete="on"
                                    ClassName={this.props.errorMessage ? "InputError" : "Input"}
                                >New password</ChatInput>
                                <ChatInput
                                    Type="password"
                                    OnChange={this.confirmPassword}
                                    Placeholder="Confirm password"
                                    ID="confirmPassword"
                                    AutoComplete="on"
                                    ClassName={this.props.errorMessage ? "InputError" : "Input"}
                                >Confirm password</ChatInput>
                            </form>
                            {this.props.errorMessage && <ErrorMessage>{this.props.errorMessage}</ErrorMessage>}
                            {this.props.successMessage && <ErrorMessage>{this.props.successMessage}</ErrorMessage>}
                            <Button ClassName="Confirm" OnClick={this.submitPassword}>Confirm</Button>
                        </div>
                    </div>
                </Options>
            </React.Fragment>
        )
    }
}

const mapStateTopProps = state => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        avatar: state.auth.avatar,
        user_id: state.auth.user_id
    }
}

const mapDispatchToProps = {
    updateAvatar,
    updatePassword,
}

export default connect(mapStateTopProps, mapDispatchToProps)(UserSettings);
