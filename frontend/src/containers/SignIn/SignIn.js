import React, { useState } from 'react';
import styles from './SignIn.module.scss';
import Input from '../../components/Input/Input';
import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '../../store/actions/index';
import { Link, useHistory } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import FetchResponse from '../../components/FetchResponse/FetchResponse';
import { clearFetchMessage } from '../../store/actions/index';
import Footer from '../../components/Footer/Footer';

const SignIn = () => {
  const { registered, errorMessage } = useSelector((state) => ({
    registered: state.auth.registerSuccess,
    errorMessage: state.auth.errorMessage,
  }));
  const dispatch = useDispatch();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();

    dispatch(signIn({ email: email, password: password }, history));

    setLoading(false);
  };

  const onEmailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChangeHandler = (e) => {
    setPassword(e.target.value);
  };

  let inputStyle = errorMessage ? styles.InputError : styles.Input;

  let errorMessageStructure = null;

  if (errorMessage) {
    errorMessageStructure = <FetchResponse>{errorMessage}</FetchResponse>;
  }

  let registerSuccess = null;

  if (registered) {
    registerSuccess = <p className={styles.RegisterSuccess}>Registration succesful, you can login</p>;
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
        <h1 className={styles.Login}>Login</h1>
        <form onSubmit={onSubmit}>
          <Input inputClass={inputStyle} inputPlaceholder="Email" inputType="email" onchange={onEmailChangeHandler} inputName="email">
            Email
          </Input>
          <Input inputClass={inputStyle} inputPlaceholder="Password" inputType="password" onchange={onPasswordChangeHandler} inputName="password">
            Password
          </Input>
          {errorMessageStructure}
          {registerSuccess}
          {submitButton}
        </form>
      </div>
      <Link to="/signup" className={styles.Link} onClick={clearFetchMessage}>
        Click here to register
      </Link>
      <Footer />
    </div>
  );
};

export default SignIn;
