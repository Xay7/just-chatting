import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import store from './store/store';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:3001' : 'https://just-chatting.herokuapp.com';

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
