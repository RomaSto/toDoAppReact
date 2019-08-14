import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { reduxSagaFirebase as rsf } from '../firebase/firebase';

import {GET_BOARDS_SUCCESS,
  GET_BOARDS_PENDING,
  GET_BOARDS_ERROR,
  UPDATE_BOARD_SUCCESS,
  UPDATE_BOARD_PENDING,
  UPDATE_BOARD_ERROR,
  GET_BOARD_SUCCESS,
  GET_BOARD_PENDING,
  GET_BOARD_ERROR,
  CREATE_BOARD_SUCCESS,
CREATE_BOARD_PENDING,
CREATE_BOARD_ERROR,
} from '../constants/actions' 

const defaultBoard = {
  name: 'Default Board',
  lanes: [
    {
      id: 'planned',
      title: 'Planned Tasks',
    },
    {
      id: 'inProgress',
      title: 'In Progress',
    },
    {
      id: 'blocked',
      title: 'Blocked',
    },
    {
      id: 'completed',
      title: 'Completed',
    },
  ],
};
function* getBoard(action) {
  try {
    yield put({ type: GET_BOARD_PENDING, payload: true });

    const userBoard = yield call(
      rsf.database.read,
      `boards/${action.payload.boardId}`,
    );

    yield put({ type: GET_BOARD_SUCCESS, payload: userBoard });
  } catch (error) {
    yield put({ type: GET_BOARD_ERROR, payload: error });
  }
  yield put({ type: GET_BOARD_PENDING, payload: false });
}
function* getBoards(action) {
  try {
    yield put({ type: GET_BOARDS_PENDING, payload: true });
    const userBoards = yield call(
      rsf.database.read,
      `users/${action.payload.id}/boards`,
    );

    if (userBoards) {
      yield put({ type: GET_BOARDS_SUCCESS, payload: userBoards });
    }
  } catch (error) {
    yield put({ type: GET_BOARDS_ERROR, payload: error });
  }
  yield put({ type: GET_BOARDS_PENDING, payload: false });
}
function* updateBoard(action) {
  yield put({ type: UPDATE_BOARD_PENDING, payload: true });
  try {
    yield call(
      rsf.database.update,
      `boards/${action.payload.boardId}/`,
      action.payload.board,
    );
    yield put({
      type: 'GET_BOARDS',
      payload: { id: action.payload.userId },
    });
  } catch (e) {
    yield put({ type: UPDATE_BOARD_ERROR, message: e.message });
  }
  yield put({ type: UPDATE_BOARD_PENDING, payload: false });
}

function* createBoard(action) {
  const newBoard = _.clone(defaultBoard, true);
  newBoard.id = action.payload.boardId;
  newBoard.users = action.payload.users;
  if (action.payload.name) {
    newBoard.name = action.payload.name;
  }
  yield put({ type: CREATE_BOARD_PENDING, payload: true });
  try {
    yield call(
      rsf.database.update,
      `boards/${action.payload.boardId}`,
      newBoard,
    );
    yield call(rsf.database.create, `users/${action.payload.userUid}/boards`, {
      boardName: newBoard.name,
      boardId: action.payload.boardId,
    });
    yield put({
      type: 'GET_BOARDS',
      payload: { id: action.payload.userUid },
    });
  } catch (e) {
    yield put({ type: CREATE_BOARD_ERROR, message: e.message });
  }
  yield put({ type: CREATE_BOARD_PENDING, payload: false });
}

function* checkUser(action) {
  const user = yield call(rsf.database.read, `users/${action.payload.uid}`);
  if (!user) {
    yield put({ type: 'CREATE_USER', payload: { ...action.payload } });
  }
}
function* createUser(action) {
  try {
    const boardId = uuidv4();
    yield call(
      rsf.database.update,
      `users/${action.payload.uid}`,
      {
        email: action.payload.email,
        displayName: action.payload.displayName,
      },
    );

    yield put({
      type: 'CREATE_BOARD',
      payload: {
        boardId,
        userUid: action.payload.uid,
        users: {
          [action.payload.uid]: action.payload.email,
        },
      },
    });
  } catch (e) {
    yield put({ type: "CREATE_BOARD_ERROR", message: e.message });
  }
}

function* shareBoard(action) {
  try {
    const users = yield call(rsf.database.read, 'users');

    const boardUsers = yield call(
      rsf.database.read,
      `boards/${action.payload.boardId}/users`,
    );

    const userExists = Object.keys(users).some(user => users[user].email === action.payload.email);
    const userId = Object.keys(users).find(user => users[user].email === action.payload.email);
    const userHasAccess = Object.keys(boardUsers)
      .some(user => boardUsers[user] === action.payload.email);

    if (!userExists) {
      action.payload.reject('No such user');
    } else if (userHasAccess) {
      action.payload.reject('This user already has access to this board');
    } else {
      yield call(
        rsf.database.create,
        `users/${userId}/boards`,
        {
          boardName: action.payload.boardName,
          boardId: action.payload.boardId,
        },
      );

      yield call(
        rsf.database.create,
        `boards/${action.payload.boardId}/users`,
        action.payload.email,
      );

      yield put({
        type: 'GET_BOARD',
        payload: { boardId: action.payload.boardId },
      });
    }
    // yield put(createUserSuccess(user));
  } catch (error) {
    // yield put(createUserFailure(error));
  }
}

export default function* rootSaga() {
  yield takeLatest('UPDATE_BOARD', updateBoard);
  yield takeLatest('GET_BOARDS', getBoards);
  yield takeLatest('GET_BOARD', getBoard);
  yield takeLatest('CHECK_USER', checkUser);
  yield takeLatest('CREATE_USER', createUser);
  yield takeLatest('SHARE_BOARD', shareBoard);
  yield takeLatest('CREATE_BOARD', createBoard);
}
