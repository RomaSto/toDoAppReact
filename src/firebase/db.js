import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>{
  db.ref(`users/${id}`).set({
    username,
    email,
  });
}
export const onceGetUsers = () =>
  db.ref('users').once('value');

export const getTodos = (id) =>
  db.ref(`users/${id}/toDos`)

export const deleteTodo = (userId, todoId) =>
  db.ref(`users/${userId}/toDos/${todoId}`).remove()

export const toggleTodo = (userId, todoId, value) =>{
  console.log(value)
  db.ref(`users/${userId}/toDos/${todoId}/completed`).set(value)
}
export const push = (authUser, todo) => {
  console.log(authUser, todo );

  db.ref(`users/${authUser.uid}/toDos`).push(
   todo
  );
  // db.ref('data').push().set({ "id": })
  // return new Promise((resolve, reject) => {
    
  //     // .push(action.text, error => error ? reject(error) : resolve());
  // });
}
export const updatePriority = (authUser, todos) => {
  // console.log(authUser, todos);

    return new Promise((resolve, reject) => {
      db.ref(`users/${authUser.uid}/toDos`).update(
        todos
      ).then((todos) => resolve(todos))
      // .push(action.text, error => error ? reject(error) : resolve());
  });



}

// Other db APIs ...
