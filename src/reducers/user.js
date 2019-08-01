import {
  USERS_SET
} from '../constants/actions'

const INITIAL_STATE = {
  users: {},
};


function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USERS_SET: {
      return {
        ...state,
        users: action.users,
      }
    }
    default: return state;
  }
}

export default userReducer;
