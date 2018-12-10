const INITIAL_STATE = {
  boards: [{ lanes: [] }],
  getBoardsPending: false
};

function todosReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GET_BOARDS_SUCCESS":
      return {
        ...state,
        boards: action.payload
      };
    case "GET_BOARDS_PENDING":
      return {
        ...state,
        getBoardsPending: action.payload
      };
    case "GET_BOARDS_ERROR":
      return {
        ...state,
        getBoardsError: action.payload
      };
    case "UPDATE_BOARD_PENDING":
      return {
        ...state,
        updateBoardPending: action.payload
      };
    case "UPDATE_BOARD_ERROR":
      return {
        ...state,
        updateBoardError: action.payload
      };

    default:
      return state;
  }
}

export { todosReducer };
