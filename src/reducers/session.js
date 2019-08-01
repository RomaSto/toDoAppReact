import {
  AUTH_USER_SET
} from '../constants/actions'

const INITIAL_STATE = {
  authUser: null,
};


export default function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER_SET: {
      return {
        ...state,
        authUser: action.authUser,
      }
    }
    default:
      return state;
  }
}
