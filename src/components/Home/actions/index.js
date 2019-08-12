import { v4 as uuidv4 } from 'uuid';
import {CREATE_BOARD,
  SHARE_BOARD,
  GET_BOARD_SUCCESS,
  GET_BOARD,
UPDATE_BOARD
} from '../../../constants/actions'

const createBoard = (name, user) =>  ({
    type: CREATE_BOARD,
    payload: {
      boardId: uuidv4(),
      name,
      userUid: user.uid,
      users: { [user.uid]: user.email },
    },
  });

const shareBoard = ({email, uid, id , name, resolve , reject}) =>  ({
    type: SHARE_BOARD,
    payload: {
      email,
      userUid: uid,
      boardId: id,
      boardName: name,
      resolve,
      reject,
    },
  });

const getBoard = (boardId ) =>  ({
    type: GET_BOARD,
    payload: { boardId: boardId },
  });

 const getBoardSuccess = () =>  ({
    type: GET_BOARD_SUCCESS,
    payload: { lanes: [], users: [] },
  });
 

 const updateBoard = (id , board, userId) =>  ({
    type: UPDATE_BOARD,
    payload: {
      boardId:id,
      board,
       userId,
    },
  });

export {
  shareBoard,
  getBoard,
  createBoard,
  getBoardSuccess, 
  updateBoard
}