import React from 'react';
import styles from './Main.module.scss';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

const Main = () => {
  // const { tokenAuthSuccess } = useSelector((state) => ({
  //   tokenAuthSuccess: state.auth.tokenSuccess,
  // }));
  // const dispatch = useDispatch();

  // let history = useHistory();
  // const tokenAccess = async () => {
  //   // await dispatch(tokenAccess());
  //   // if (tokenAuthSuccess) {
  //   //   history.push('/chat');
  //   // } else {
  //   //   history.push('/signin');
  //   // }
  // };

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
          <button className={styles.Login} onClick={null}>
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className={styles.Register}>Register</button>
        </Link>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Main;
