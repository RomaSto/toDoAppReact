import { combineReducers } from 'redux';
import sessionReducer from '../components/Session/reducer';
import todosReducer from '../components/Home/reducer';

import userReducer from '../components/SignIn/reducer';

const rootReducer = combineReducers({
  sessionReducer,
  userReducer,
  todosReducer,
});

export default rootReducer;
