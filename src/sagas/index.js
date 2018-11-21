import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
// import Api from "...";
import { db } from "../firebase";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions

function* fetchTodos(action) {
  try {
    // const firstTodo = yield call(rsf.database.read, "todos/1");
    // yield put(gotTodo(firstTodo));
    // db.getTodos(firebase.auth().currentUser.uid).on("value", snapshot => {
    //   console.log("snapshot", snapshot.val());
    //   let todosFromServer = snapshot.val();
    //   console.log(Object.keys(todosFromServer));
    //   Object.keys(todosFromServer).map(el => {});
    //   // this.setState({ todosFromServer });
    //   // console.log(this.state.todosFromServer);
    // });
    // const user = yield call(Api.fetchUser, action.payload.userId);
    // yield put({ type: "USER_FETCH_SUCCEEDED", user: user });
  } catch (e) {
    yield put({ type: "USER_FETCH_FAILED", message: e.message });
  }
}
function* addTodo(action) {
  try {
    const response = yield db.push(
      action.payload.authUser,
      action.payload.toDo
    );
    // console.log("response", response);

    // const user = yield call(Api.fetchUser, action.payload.userId);
    // yield put({ type: "USER_FETCH_SUCCEEDED", user: user });
  } catch (e) {
    yield put({ type: "ADD_TODO_FAILED", message: e.message });
  }
}
function* createUserSaga(email, password) {
  // try {
  //   const user = yield call(
  //     rsf.auth.createUserWithEmailAndPassword,
  //     email,
  //     password
  //   );
  //   // yield put(createUserSuccess(user));
  // } catch (error) {
  //   // yield put(createUserFailure(error));
  // }
}

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
}
