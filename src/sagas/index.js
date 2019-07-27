import { call, put, all, takeEvery, takeLatest } from "redux-saga/effects";
import { db } from "../firebase";
import _ from "lodash";
import { reduxSagaFirebase as rsf } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";

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
function* getBoard(action) {
  try {
    yield put({ type: "GET_BOARD_PENDING", payload: true });

    let userBoard = yield call(
      rsf.database.read,
      `boards/${action.payload.boardId}`
    );

    yield put({ type: "GET_BOARD_SUCCESS", payload: userBoard });
  } catch (error) {
    yield put({ type: "GET_BOARD_FAILED", payload: error });
  }
  yield put({ type: "GET_BOARD_PENDING", payload: false });
}
function* getBoards(action) {
  console.log("getBoards", action);
  try {
    yield put({ type: "GET_BOARDS_PENDING", payload: true });
    const userBoards = yield call(
      rsf.database.read,
      `users/${action.payload.id}/boards`
    );

    if (userBoards) {
      yield put({ type: "GET_BOARDS_SUCCESS", payload: userBoards });
    } else {
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
      `boards/${action.payload.boardId}/`,
      action.payload.board
    );
    yield put({
      type: "GET_BOARDS",
      payload: { id: action.payload.userId }
    });
  } catch (e) {
    yield put({ type: "UPDATE_BOARD_FAILED", message: e.message });
  }
  yield put({ type: "UPDATE_BOARD_PENDING", payload: false });
}

function* createBoard(action) {
  console.log("action", action);
  let newBoard = _.clone(defaultBoard, true);
  newBoard.id = action.payload.boardId;
  newBoard.users = action.payload.users;
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
    yield call(rsf.database.create, `users/${action.payload.userUid}/boards`, {
      boardName: newBoard.name,
      boardId: action.payload.boardId
    });
    yield put({
      type: "GET_BOARDS",
      payload: { id: action.payload.userUid }
    });
  } catch (e) {
    yield put({ type: "CREATE_BOARD_FAILED", message: e.message });
  }
  yield put({ type: "CREATE_BOARD_PENDING", payload: false });
}

function* checkUser(action) {
  const user = yield call(rsf.database.read, `users/${action.payload.uid}`);
  if (!user) {
    yield put({ type: "CREATE_USER", payload: { ...action.payload } });
  }
}
function* createUser(action) {
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

    let board = yield put({
      type: "CREATE_BOARD",
      payload: {
        boardId: boardId,
        userUid: action.payload.uid,
        users: {
          [action.payload.uid]: action.payload.email
        }
      }
    });
    console.log("board", board);
  } catch (e) {
    console.log(e);

    // yield put({ type: "CREATE_BOARD_FAILED", message: e.message });
  }
}

function* shareBoard(action) {
  try {
    const users = yield call(rsf.database.read, `users`);

    const boardUsers = yield call(
      rsf.database.read,
      `boards/${action.payload.boardId}/users`
    );

    let userExists = Object.keys(users).some(user => {
      return users[user].email === action.payload.email;
    });
    let userHasAccess = Object.keys(boardUsers).some(user => {
      return boardUsers[user] === action.payload.email;
    });

    if (!userExists) {
      action.payload.reject("No such user");
    } else if (userHasAccess) {
      action.payload.reject("This user already has access to this board");
    } else {
      yield call(
        rsf.database.create,
        `users/${action.payload.userUid}/boards`,
        {
          boardName: action.payload.boardName,
          boardId: action.payload.boardId
        }
      );

      yield call(
        rsf.database.create,
        `boards/${action.payload.boardId}/users`,
        action.payload.email
      );

      yield put({
        type: "GET_BOARD",
        payload: { boardId: action.payload.boardId }
      });
    }
    // yield put(createUserSuccess(user));
  } catch (error) {
    // yield put(createUserFailure(error));
  }
}

// const createUserSuccess = user => ({ type: "CREATE_USER_SUCCESS", user });
// const createUserSuccess = user => ({ type: "CREATE_USER_SUCCESS", user });
// const createUserFailure = error => ({ type: "CREATE_USER_FAILURE", error });

export default function* rootSaga() {
  yield takeLatest("UPDATE_BOARD", updateBoard);
  yield takeLatest("GET_BOARDS", getBoards);
  yield takeLatest("GET_BOARD", getBoard);
  yield takeLatest("CHECK_USER", checkUser);
  yield takeLatest("CREATE_USER", createUser);
  yield takeLatest("SHARE_BOARD", shareBoard);
  yield takeLatest("CREATE_BOARD", createBoard);
}
