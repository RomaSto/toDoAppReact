import { push} from '../firebase/db'
const INITIAL_STATE = {
  authUser: null,
};

const applySetAuthUser = (state, action) => ({
  ...state,
  authUser: action.authUser
});

function sessionReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'AUTH_USER_SET' : {
      return applySetAuthUser(state, action);
    }
    default : return state;
  }
}

// function todoReducer(state = {}, action) {
//   switch (action.type) {
//     case 'CREATE_TODO_REQUEST': {
//       return push(state, action);
//     }
//     default: return state;
//   }
// }





export { sessionReducer} ;