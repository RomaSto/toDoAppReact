import {
  CREATE_TODO_ERROR,
  CREATE_TODO_SUCCESS,
  CREATE_TODO_REQUEST,
  REMOVE_TODO_ERROR,
  REMOVE_TODO_SUCCESS,
  FILTER_TODOS,
  LOAD_TODOS_SUCCESS,
  UNDELETE_TODO_ERROR,
  UNLOAD_TODOS_SUCCESS,
  UPDATE_TODO_ERROR,
  UPDATE_TODO_SUCCESS
} from './actionTypes';


export const createTodoRequest = text => {
  return {
    type: CREATE_TODO_REQUEST,
    id: Date.now(),
    text
  };
}

export const toggleTodo = id => {
  return {
    type: TOGGLE_TODO,
    id
  }
}

export const createTodoSuccess = () => {
  return {
    type: CREATE_TODO_SUCCESS,
  }
}