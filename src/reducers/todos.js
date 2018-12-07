const INITIAL_STATE = {
  todos: {
    lanes: [
      {
        id: "planned",
        title: "Planned Tasks",
        label: "2/2",
        cards: []
      },
      {
        id: "completed",
        title: "Completed",
        label: "0/0",
        cards: []
      }
    ]
  },
  getTodosPending: false
};

function todosReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "GET_TODOS_SUCCESS":
      return {
        ...state,
        todos: action.payload
      };
    case "GET_TODOS_PENDING":
      return {
        ...state,
        getTodosPending: action.payload
      };

    default:
      return state;
  }
}

export { todosReducer };
