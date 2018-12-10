import { call, put, all, takeEvery, takeLatest } from "redux-saga/effects";
import { db } from "../firebase";
import _ from "lodash";
import { reduxSagaFirebase as rsf } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions

let defaultBoard = {
  name: "Default Board",
  lanes: [
    {
      id: "planned",
      title: "Planned Tasks"
    },
    {
      id: "inProgress",
      title: "In Progress"
    },
    {
      id: "blocked",
      title: "Blocked"
    },
    {
      id: "completed",
      title: "Completed"
    }
  ]
};
function* getBoards(action) {
  try {
    yield put({ type: "GET_BOARDS_PENDING", payload: true });
    const userBoardsKeys = yield call(
      rsf.database.read,
      `users/${action.payload.id}/boards`
    );
    let boardKeys = yield Object.keys(userBoardsKeys);
    let boardIdArray = [];
    for (let wrapper of boardKeys) {
      boardIdArray.push(userBoardsKeys[wrapper].boardId);
    }
    // let bossards
    let userBoards = yield all(
      boardIdArray.map(boardId => {
        return call(rsf.database.read, `boards/${boardId}`);
      })
    );
    console.log(userBoards);

    if (userBoards[0]) {
      yield put({ type: "GET_BOARDS_SUCCESS", payload: userBoards });
    } else {
      yield put({ type: "GET_BOARDS_SUCCESS", payload: [defaultBoard] });
    }
  } catch (error) {
    yield put({ type: "GET_BOARDS_FAILED", payload: error });
  }
  yield put({ type: "GET_BOARDS_PENDING", payload: false });
}
function* updateBoard(action) {
  console.log("action", action);
  yield put({ type: "UPDATE_BOARD_PENDING", payload: true });
  try {
    yield call(
      rsf.database.update,
      `users/${action.payload.userUid}/board`,
      action.payload.board
    );
  } catch (e) {
    yield put({ type: "UPDATE_BOARD_FAILED", message: e.message });
  }
  yield put({ type: "UPDATE_BOARD_PENDING", payload: false });
}

function* createBoard(action) {
  console.log("action", action);
  let newBoard = _.clone(defaultBoard, true);
  if (action.payload.name) {
    newBoard.name = action.payload.name;
  }
  yield put({ type: "CREATE_BOARD_PENDING", payload: true });
  try {
    yield call(
      rsf.database.update,
      `boards/${action.payload.boardId}`,
      newBoard
    );
    console.log("action", action);
  } catch (e) {
    yield put({ type: "CREATE_BOARD_FAILED", message: e.message });
  }
  yield put({ type: "CREATE_BOARD_PENDING", payload: false });
}

function* checkUser(action) {
  const user = yield call(rsf.database.read, `users/${action.payload.uid}`);
  console.log("checkUser sdvdsfdsdsdsdsdsds", user);
  if (!user) {
    yield put({ type: "CREATE_USER", payload: { ...action.payload } });
  }
  // yield put(gotTodo(firstTodo));
}
function* createUser(action) {
  console.log("action.payload.uid", action.payload.uid);
  try {
    let boardId = uuidv4();
    const user = yield call(
      rsf.database.update,
      `users/${action.payload.uid}`,
      {
        email: action.payload.email,
        displayName: action.payload.displayName
      }
    );
    console.log("user", user);

    let board = yield put({
      type: "CREATE_BOARD",
      payload: { boardId: boardId }
    });
    console.log("board", board);
    let key = yield call(
      rsf.database.create,
      `users/${action.payload.uid}/boards`,
      { boardId: boardId }
    );
    console.log("key", key);
  } catch (e) {
    console.log(e);

    // yield put({ type: "CREATE_BOARD_FAILED", message: e.message });
  }

  // if (!user) {
  //   yield put({ type: "CREATE_USER", payload: { ...action.payload } });
  // }
  // yield put(gotTodo(firstTodo));
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
  yield takeLatest("GET_BOARDS", getBoards);
  yield takeLatest("CHECK_USER", checkUser);
  yield takeLatest("CREATE_USER", createUser);
  yield takeLatest("CREATE_BOARD", createBoard);
}
