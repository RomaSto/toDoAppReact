import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
// import Api from "...";
import { db } from "../firebase";
import { reduxSagaFirebase as rsf } from "../firebase/firebase";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions

function* getTodos(action) {
  try {
    const todos = yield call(
      rsf.database.read,
      `users/${action.payload.id}/toDos`
    );
    console.log("inside v", action.payload.id);
    console.log(todos);

    yield put({ type: "GET_TODOS_SUCCESS", payload: todos });
  } catch (error) {
    yield put({ type: "GET_TODOS_FAILED", payload: error });
  }
}
// function* fetchTodos(action) {
//   try {
//     export const getTodos = id => db.ref(`users/${id}/toDos`);
//     // const firstTodo = yield call(rsf.database.read, "todos/1");
//     // yield put(gotTodo(firstTodo));
//     // db.getTodos(firebase.auth().currentUser.uid).on("value", snapshot => {
//     //   console.log("snapshot", snapshot.val());
//     //   let todosFromServer = snapshot.val();
//     //   console.log(Object.keys(todosFromServer));
//     //   Object.keys(todosFromServer).map(el => {});
//     //   // this.setState({ todosFromServer });
//     //   // console.log(this.state.todosFromServer);
//     // });
//     // const user = yield call(Api.fetchUser, action.payload.userId);
//     // yield put({ type: "USER_FETCH_SUCCEEDED", user: user });
//   } catch (e) {
//     yield put({ type: "USER_FETCH_FAILED", message: e.message });
//   }
// }
function* updateBoard(action) {
  console.log("action", action);

  try {
    yield call(
      rsf.database.update,
      `users/${action.payload.userUid}/board`,
      action.payload.board
    );
  } catch (e) {
    yield put({ type: "UPDATE_BOARD_FAILED", message: e.message });
  }
}
function* addTodo(action) {
  try {
    const response = yield db.push(
      action.payload.authUser,
      action.payload.toDo
    );
    console.log("response", response);

    // const user = yield call(Api.fetchUser, action.payload.userId);
    // yield put({ type: "USER_FETCH_SUCCEEDED", user: user });
  } catch (e) {
    yield put({ type: "ADD_TODO_FAILED", message: e.message });
  }
}
function* createUserSaga(email, password) {
  try {
    const user = yield call(
      rsf.auth.createUserWithEmailAndPassword,
      email,
      password
    );
    yield put(createUserSuccess(user));
  } catch (error) {
    yield put(createUserFailure(error));
  }
}

// const createUserSuccess = user => ({ type: "CREATE_USER_SUCCESS", user });
const createUserSuccess = user => ({ type: "CREATE_USER_SUCCESS", user });
const createUserFailure = error => ({ type: "CREATE_USER_FAILURE", error });

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
// function* mySaga() {
//   yield takeEvery("ADD_TODO", addTodo);
// }

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
// function* mySaga() {
//   yield takeEvery("ADD_TODO", addTodo);
// }
export default function* rootSaga() {
  yield takeLatest("ADD_TODO", addTodo);
  yield takeLatest("UPDATE_BOARD", updateBoard);
  yield takeLatest("GET_TODOS", getTodos);
}
