const INITIAL_STATE = {
  todos: null
};

function todosReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GET_TODOS_SUCCESS":
      return {
        ...state,
        todos: action.payload
      };

    default:
      return state;
  }
}

export { todosReducer };
