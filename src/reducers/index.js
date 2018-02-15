import { combineReducers } from 'redux';
import {sessionReducer, todoReducer} from './session';
import userReducer from './user';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  // todos: todoReducer
});

export default rootReducer;
