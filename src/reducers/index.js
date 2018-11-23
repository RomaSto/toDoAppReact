import { combineReducers } from "redux";
import { sessionReducer } from "./session";
import { todosReducer } from "./todos";

import userReducer from "./user";

const rootReducer = combineReducers({
  sessionReducer,
  userReducer,
  todosReducer
});

export default rootReducer;
