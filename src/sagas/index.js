import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
// import Api from "...";
import { db } from "../firebase";
import { reduxSagaFirebase as rsf } from "../firebase/firebase";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions

function* getTodos(action) {
  // let defaultBoard = {
  //   lanes: [
  //     {
  //       id: "planned",
  //       title: "Planned Tasks",
  //       label: "2/2",
  //       cards: []
  //     },
  //     {
  //       id: "completed",
  //       title: "Completed",
  //       label: "0/0",
  //       cards: []
  //     }
  //   ]
  // };
  try {
    yield put({ type: "GET_TODOS_PENDING", payload: true });
    const todos = yield call(
      rsf.database.read,
      `users/${action.payload.id}/board`
    );
    console.log("inside v", action.payload.id);
    console.log(todos);
    // if (todos.lanes) {
    yield put({ type: "GET_TODOS_SUCCESS", payload: todos });
    // } else {
    //   yield put({ type: "GET_TODOS_SUCCESS", payload: defaultBoard });
    // }
  } catch (error) {
    yield put({ type: "GET_TODOS_FAILED", payload: error });
  }
  yield put({ type: "GET_TODOS_PENDING", payload: false });
}
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
  console.log("addTodo", action);

  try {
    yield call(
      rsf.database.create,
      `users/${action.payload.userUid}/board/lanes/${action.payload.laneId}`,
      action.payload.card
    );
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
