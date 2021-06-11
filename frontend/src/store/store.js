import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/auth';
import chatReducer from './reducers/chatroom';
import { LOGOUT } from './actions/actionTypes';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  auth: authReducer,
  chat: chatReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return reducers(state, action);
};

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
