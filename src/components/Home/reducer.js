import {GET_BOARDS_SUCCESS,
  GET_BOARDS_PENDING,
  GET_BOARDS_ERROR,
  UPDATE_BOARD_SUCCESS,
  UPDATE_BOARD_PENDING,
  UPDATE_BOARD_ERROR,
  GET_BOARD_SUCCESS,
  GET_BOARD_PENDING,
  GET_BOARD_ERROR,
} from '../../constants/actions'

const INITIAL_STATE = {
  boards: {},
  getBoardsPending: false,
  currentBoard: { lanes: [], users: [] },
};

export default function todosReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_BOARDS_SUCCESS:
      return {
        ...state,
        boards: action.payload,
      };
    case GET_BOARDS_PENDING:
      return {
        ...state,
        getBoardsPending: action.payload,
      };
    case GET_BOARDS_ERROR:
      return {
        ...state,
        getBoardsError: action.payload,
      };
    case UPDATE_BOARD_PENDING:
      return {
        ...state,
        updateBoardPending: action.payload,
      };
    case UPDATE_BOARD_ERROR:
      return {
        ...state,
        updateBoardError: action.payload,
      };
    case GET_BOARD_SUCCESS:
      return {
        ...state,
        currentBoard: action.payload,
      };

    default:
      return state;
  }
}
