import React, { useState } from 'react';
import styles from './SignUp.module.scss';
import Input from '../../components/Input/Input';
import { useSelector, useDispatch } from 'react-redux';
import { signUp } from '../../store/actions/index';
import { Link, useHistory } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import FetchResponse from '../../components/FetchResponse/FetchResponse';
import { clearFetchMessage } from '../../store/actions/index';
import Footer from '../../components/Footer/Footer';

const SignUp = () => {
  const { registered, errorMessage } = useSelector((state) => ({
    registered: state.auth.registerSuccess,
    errorMessage: state.auth.errorMessage,
  }));
  const dispatch = useDispatch();
  const history = useHistory();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);

    dispatch(signUp(formData, history));

    setLoading(false);
  };

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  let inputStyle = errorMessage ? styles.InputError : styles.Input;

  let errorMessageStructure = (
    <div className={styles.Information}>
      <p className={styles.ErrorParagraph}>Name must be longer than 3 characters</p>
      <p className={styles.ErrorParagraph}>Password must be longer than 6 characters</p>
    </div>
  );

  if (errorMessage) {
    errorMessageStructure = (
      <div className={styles.ErrorMessage}>
        <FetchResponse>{errorMessage}</FetchResponse>
        <p className={styles.ErrorParagraph}>Name must be longer than 3 characters</p>
        <p className={styles.ErrorParagraph}>Password must be longer than 6 characters</p>
      </div>
    );
  }

  let submitButton = (
    <button type="submit" onClick={onSubmit} className={styles.SubmitBtn}>
      SUBMIT
    </button>
  );

  if (loading) {
    submitButton = <Spinner />;
  }

  return (
    <div className={styles.Body}>
      <div className={styles.Form}>
        <h1 className={styles.Login}>Register</h1>
        <form onSubmit={onSubmit}>
          <Input inputClass={inputStyle} inputPlaceholder="Name" inputType="text" onchange={onChangeHandler} inputName="name">
            Username
          </Input>
          <Input inputClass={inputStyle} inputPlaceholder="Email" inputType="email" onchange={onChangeHandler} inputName="email">
            Email
          </Input>
          <Input inputClass={inputStyle} inputPlaceholder="Password" inputType="password" onchange={onChangeHandler} inputName="password">
            Password
          </Input>
          {errorMessageStructure}
        </form>
        {submitButton}
      </div>
      <Link to="/signin" className={styles.Link} onClick={clearFetchMessage}>
        If you have an account sign in here
      </Link>
      <Footer />
    </div>
  );
};

export default SignUp;
